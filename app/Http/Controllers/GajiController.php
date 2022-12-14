<?php

namespace App\Http\Controllers;

use App\Exports\exportGaji;
use App\Exports\exportSlip;
use App\Models\BaseGaji;
use App\Models\Gaji;
use App\Models\Kenaikan;
use App\Models\Pegawai;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Webpatser\Uuid\Uuid;

class GajiController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['export', 'exportSlip']]);
  }

  public function index()
  {
    $jabatanAll = Gaji::with('pegawai', 'pegawai.jabatan', 'comment')
      ->whereRelation('pegawai', 'is_aktif', "1")
      ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
      ->get();
    return response()->json(['msg' => 'get all data', "data" => $jabatanAll, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'pegawai_id' => 'required',
      'bonus' => 'required|numeric',
      'potongan' => 'required|numeric',
    ], [
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be numeric',
      // 'gt' =>  'The :attribute must be greater than 0',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_gaji' => Uuid::generate()->string,
        'pegawai_id' => $request->pegawai_id,
        'periode' => $request->periode,
        'total_hadir' => $request->total_hadir,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
        'gaji_harian' => $request->gaji_pokok_harian,
        'tunjangan_harian' => $request->tunjangan_harian,
        'bonus' => $request->bonus,
        'potongan' => $request->potongan,
        'total' => $request->totalFinal,
        'created_at' => round(microtime(true) * 1000),
      ];
      Gaji::create($payload);
      unset($payload['id_gaji']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data gaji', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data gaji', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function getGaji(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'pegawai_id' => 'required',
      'month' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $pegawaiId = $request->pegawai_id;
    $pegawai = Pegawai::find($pegawaiId);
    $status_pegawai = $pegawai->status_pegawai;
    $moth = json_decode($request->month);
    $dateAwal = $moth->awal;
    $dateAkhir = $moth->akhir;

    $sqlHadir = "select count(id_absen) as 'kehadiran' from absens
                      WHERE keterangan = 'Hadir' AND pegawai_id = '$pegawaiId'
                      AND (UNIX_TIMESTAMP(tanggal) * 1000) BETWEEN '$dateAwal' and '$dateAkhir' AND index_cuti='0';";
    $hadirAbsen = DB::select($sqlHadir)[0]->kehadiran;
    $sqlIjin = "select count(id_absen) as 'kehadiran' from absens
                      WHERE keterangan = 'Ijin' AND pegawai_id = '$pegawaiId'
                      AND (UNIX_TIMESTAMP(tanggal) * 1000) BETWEEN '$dateAwal' and '$dateAkhir' AND index_cuti='0';";
    $ijinAbsen = DB::select($sqlIjin)[0]->kehadiran;
    $sqlSakit = "select count(id_absen) as 'kehadiran' from absens
                      WHERE keterangan = 'Sakit' AND pegawai_id = '$pegawaiId'
                      AND (UNIX_TIMESTAMP(tanggal) * 1000) BETWEEN '$dateAwal' and '$dateAkhir' AND index_cuti='0';";
    $sakitAbsen = DB::select($sqlSakit)[0]->kehadiran;

    $kehadiranAbsen = (int)$hadirAbsen + (int)$ijinAbsen + (int)$sakitAbsen;

    $sqlCuti = "select COUNT(cutis.id_cuti) as 'count', cutis.keterangan, absens.pegawai_id from absens
                  INNER JOIN cutis on cutis.id_cuti = absens.index_cuti
                  WHERE absens.pegawai_id = '$pegawaiId' AND
                  (UNIX_TIMESTAMP(tanggal) * 1000) BETWEEN '$dateAwal' AND '$dateAkhir' AND is_aprove = '1'";
    $cutiData = DB::select($sqlCuti)[0];
    $dayOfMonth = date("t", substr($dateAwal, 0, 10));
    $jumlah = (int)$cutiData->count === (int)$dayOfMonth ? (int)$cutiData->count - 4 : (int)$cutiData->count;

    $jumlah_pokok = 0;
    $jumlah_tunjangan = 0;
    if ((int)$status_pegawai === 0) {
      $jumlah_pokok =  $kehadiranAbsen + $jumlah;
    } else {
      $jumlah_pokok =  $kehadiranAbsen + $jumlah;
      if($cutiData->keterangan === 'lahiran') {
        $jumlah_tunjangan =  $kehadiranAbsen + $jumlah;
      } else {
        $jumlah_tunjangan =  $kehadiranAbsen;
      }
    }

    $gaji_pokok = 0;
    $tunjangan = 0;
    $countListGaji = BaseGaji::where('jabatan_id',$pegawai->jabatan_id);
    if($countListGaji->count() > 1) {
      if((int)$status_pegawai === 0) {
        $data = BaseGaji::find(4);
      } else {
        $data = BaseGaji::find(3);
      }
      $gaji_pokok = $data->gaji_pokok;
      $tunjangan = $data->tunjangan;
    } else {
      $gaji_pokok = $countListGaji->first()->gaji_pokok;
      $tunjangan = $countListGaji->first()->tunjangan;
    }

    $achievement = Kenaikan::where('pegawai_id',$pegawaiId)->where('is_status','1')->get()->count();
    if($achievement>0) {
      $gaji_pokok += (int)$achievement * 100000;
    }

    $data = [
      'atas' => [
        'nama' => $pegawai->nama_pegawai,
        'jabatan' => $pegawai->jabatan->nama_jabatan,
        'dayofmonth' => $dayOfMonth,
        'kehadiran' => $jumlah_pokok,
        'offday' => $dayOfMonth - $jumlah_pokok - 4,
        'gaji_pokok' => $gaji_pokok,
        'tunjangan' => $tunjangan,
        'status_pegawai' => $status_pegawai,
        'pencapaian' => $achievement
      ],
      'bawah' => [
        'gaji_pokok_harian' => $gaji_pokok / ($dayOfMonth - 4),
        'tunjangan_harian' => $tunjangan / ($dayOfMonth - 4),
        'total_pokok_harian' => ($gaji_pokok / ($dayOfMonth - 4)) * $jumlah_pokok,
        'total_tunjangan_harian' => ($tunjangan / ($dayOfMonth - 4)) * $jumlah_tunjangan,
        'total_kenaikan' => (int)$achievement * 100000
      ]
    ];

    return response()->json(['data' => $data, 'error' => []], 200);
  }

  public function getPegawaiNonGaji(Request $request)
  {
    $periode = $request->periode;
    $id = $request->id;
    if ($request->act === 'save') {
      $sql = "SELECT tabel.*, gajis.pegawai_id FROM (
                SELECT t1.* from pegawais t1
                INNER JOIN jabatans j ON j.id_jabatan = t1.jabatan_id
                LEFT JOIN (
                      SELECT gajis.* FROM gajis
                      INNER JOIN pegawais ON pegawais.id_pegawai = gajis.pegawai_id
                      INNER JOIN jabatans on jabatans.id_jabatan = pegawais.jabatan_id
                            WHERE periode = '$periode' AND pegawais.is_aktif = '1' AND jabatans.is_aktif = '1'
                ) AS pivot1 ON pivot1.pegawai_id = t1.id_pegawai
                WHERE t1.is_aktif = '1' AND j.is_aktif = '1'
              ) AS tabel
              LEFT JOIN gajis ON gajis.pegawai_id = tabel.id_pegawai
              WHERE gajis.pegawai_id IS NULL";
    } else {
      // $sql = "SELECT t1.*, pivot1.pegawai_id from pegawais t1
      //         LEFT JOIN (
      //         SELECT * FROM gajis
      //         WHERE periode = '$periode'
      //         ) AS pivot1 ON pivot1.pegawai_id = t1.id_pegawai
      //         WHERE pivot1.pegawai_id IS NULL OR pivot1.pegawai_id = '$id'";
      $sql = "SELECT tabel.*, gajis.pegawai_id FROM (
                SELECT t1.* from pegawais t1
                INNER JOIN jabatans j ON j.id_jabatan = t1.jabatan_id
                LEFT JOIN (
                      SELECT gajis.* FROM gajis
                      INNER JOIN pegawais ON pegawais.id_pegawai = gajis.pegawai_id
                      INNER JOIN jabatans on jabatans.id_jabatan = pegawais.jabatan_id
                            WHERE periode = '$periode' AND pegawais.is_aktif = '1' AND jabatans.is_aktif = '1'
                ) AS pivot1 ON pivot1.pegawai_id = t1.id_pegawai
                WHERE t1.is_aktif = '1' AND j.is_aktif = '1'
              ) AS tabel
              LEFT JOIN gajis ON gajis.pegawai_id = tabel.id_pegawai
              WHERE gajis.pegawai_id IS NULL OR gajis.pegawai_id = '$id'";
    }
    $data = DB::select($sql);
    return response()->json(['msg' => 'Get pegawai Not Has User', "data" => $data, 'error' => []], 200);
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'pegawai_id' => 'required',
      'bonus' => 'required|numeric',
      'potongan' => 'required|numeric',
    ], [
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be numeric',
      // 'gt' =>  'The :attribute must be greater than 0',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $gajiFind = Gaji::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'pegawai_id' => $request->pegawai_id,
        'periode' => $request->periode,
        'total_hadir' => $request->total_hadir,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
        'gaji_harian' => $request->gaji_pokok_harian,
        'tunjangan_harian' => $request->tunjangan_harian,
        'bonus' => $request->bonus,
        'potongan' => $request->potongan,
        'total' => $request->totalFinal,
      ];
      $gajiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data gaji', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data gaji', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $gajiFind = Gaji::findOrFail($id);
    DB::beginTransaction();
    try {
      $gajiFind->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data gaji', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data gaji', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function Validasi($id)
  {
    $gaji = Gaji::find($id);
    $gaji->update([
      'is_valid' => 1,
    ]);
    return response()->json(['msg' => 'Successfuly updated data validasi', "data" => [], 'error' => []], 200);
  }

  public function getDataLaporan($id, $awal, $akhir)
  {
    $sql = "SELECT g.*, p.nama_pegawai, p.nik, p.status_pegawai, j.nama_jabatan FROM gajis g
            INNER JOIN pegawais p on p.id_pegawai =g.pegawai_id
            INNER JOIN jabatans j on j.id_jabatan = p.jabatan_id
            WHERE periode BETWEEN '$awal' AND '$akhir' and g.is_valid = '1'
            AND p.is_aktif = '1' AND j.is_aktif='1'
            ";
    if ($id !== 'all') {
      $sql .= "AND g.pegawai_id = '$id'";
    }
    $data = DB::select($sql);
    return $data;
  }

  public function laporan(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $data = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    return response()->json(['msg' => 'Successfuly get data gaji', "data" => $data, 'error' => []], 200);
  }

  public function export(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $gaji = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    $awal = date("Y-m-d", substr($periode->awal, 0, 10));
    $akhir = date("Y-m-d", substr($periode->akhir, 0, 10));
    return Excel::download(new exportGaji($gaji, $periode), 'gaji-laporan-dicetak-' . $awal . '-' . $akhir . '.xlsx');
  }

  public function exportSlip($id)
  {
    $gaji = Gaji::with('pegawai', 'pegawai.jabatan', 'comment')->where('pegawai_id', $id)->get();
    return Excel::download(new exportSlip($gaji), 'slip-gaji-dicetak-' . date('Y-m-d') . '.xlsx');
  }

  public function pegawai_slip(Request $request)
  {
    if ($request->role == '1' or $request->role == '3') {
      $jabatanAll = Gaji::with('pegawai', 'pegawai.jabatan', 'comment')
        ->where('pegawai_id', $request->id)
        ->where('is_valid', 1)->get();
      return response()->json(['msg' => 'get all data', "data" => $jabatanAll, 'error' => []], 200);
    } else {
      $jabatanAll = Gaji::with('pegawai', 'pegawai.jabatan', 'comment')
        ->where('is_valid', 1)->get();
      return response()->json(['msg' => 'get all data', "data" => $jabatanAll, 'error' => []], 200);
    }
  }
}
