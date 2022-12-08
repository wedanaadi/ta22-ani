<?php

namespace App\Http\Controllers;

use App\Exports\ExportAbsen;
use App\Imports\ImportAbsen;
use App\Models\Absen;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Webpatser\Uuid\Uuid;

class AbsenController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['export']]);
  }

  public function index()
  {
    $absen = Absen::with('pegawai', 'pegawai.jabatan')
      ->whereRelation('pegawai', 'is_aktif', "1")
      ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
      ->orderBy('tanggal', 'ASC')
      ->get();
    return response()->json(['msg' => 'get all absen', "data" => $absen, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'tanggal' => 'required',
      'keterangan' => 'required',
      'pegawai_id' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_absen' => Uuid::generate()->string,
        'tanggal' => Carbon::parse($request->tanggal)->format('Y-m-d'),
        'keterangan' => $request->keterangan,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
      ];
      Absen::create($payload);
      unset($payload['id_absen']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data absen', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data absen', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'tanggal' => 'required',
      'keterangan' => 'required',
      'pegawai_id' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $findAbsen = Absen::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'id_absen' => Uuid::generate()->string,
        'tanggal' => Carbon::parse($request->tanggal)->format('Y-m-d'),
        'keterangan' => $request->keterangan,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
      ];
      $findAbsen->update($payload);
      unset($payload['id_absen']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data absen', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data absen', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $findAbsen = Absen::findOrFail($id);
    DB::beginTransaction();
    try {
      $findAbsen->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data absen', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data absen', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function getPegawaiNotCuti(Request $request)
  {
    $now = $request->now;
    if ($request->act === 'save') {
      $sql = "SELECT p.*, tpv.pegawai_id AS 'id_pegawai_absen' FROM pegawais p
              INNER JOIN jabatans j ON j.id_jabatan = p.jabatan_id
              LEFT JOIN (
                SELECT a.*, pvcuti.pegawai_id AS 'cuti_pegawai' FROM absens a
                LEFT JOIN (
                  SELECT cutis.pegawai_id FROM cutis
                  WHERE (UNIX_TIMESTAMP(tanggal_mulai) * 1000) <= '$now'
                  AND (UNIX_TIMESTAMP(tanggal_selesai) * 1000) >= '$now'
                  AND is_aprove = '1'
                ) AS pvcuti ON pvcuti.pegawai_id = a.pegawai_id
                WHERE pvcuti.pegawai_id IS NOT NULL OR (UNIX_TIMESTAMP(tanggal) * 1000) = '$now'
              ) AS tpv ON tpv.pegawai_id = p.id_pegawai
              WHERE tpv.pegawai_id IS NULL AND p.is_aktif = '1' AND j.is_aktif = '1'";
    } else {
      $id = $request->id;
      $sql = "SELECT p.*, tpv.pegawai_id AS 'id_pegawai_absen' FROM pegawais p
              INNER JOIN jabatans j ON j.id_jabatan = p.jabatan_id
              LEFT JOIN (
                SELECT a.*, pvcuti.pegawai_id AS 'cuti_pegawai' FROM absens a
                LEFT JOIN (
                  SELECT cutis.pegawai_id FROM cutis
                  WHERE (UNIX_TIMESTAMP(tanggal_mulai) * 1000) <= '$now'
                  AND (UNIX_TIMESTAMP(tanggal_selesai) * 1000) >= '$now'
                  AND is_aprove = '1'
                ) AS pvcuti ON pvcuti.pegawai_id = a.pegawai_id
                WHERE pvcuti.pegawai_id IS NOT NULL OR (UNIX_TIMESTAMP(tanggal) * 1000) = '$now'
              ) AS tpv ON tpv.pegawai_id = p.id_pegawai
              WHERE tpv.pegawai_id IS NULL AND p.is_aktif = '1' AND j.is_aktif = '1'";
    }

    $data = DB::select($sql);
    return response()->json(['msg' => 'Get pegawai tersedia', "data" => $data, 'error' => []], 200);
  }

  public function import(Request $request)
  {
    DB::beginTransaction();
    try {
      Excel::import(new ImportAbsen, request()->file('file'));
      DB::commit();
      return response()->json(['msg' => 'Successfuly import data absen', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail import data absen', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function getDataLaporan($id, $awal, $akhir)
  {
    $sql = "SELECT a.*, p.nama_pegawai, p.nik, j.nama_jabatan FROM absens a
            INNER JOIN pegawais p on p.id_pegawai = a.pegawai_id
            INNER JOIN jabatans j on j.id_jabatan = p.jabatan_id
            WHERE (UNIX_TIMESTAMP(a.tanggal)*1000) BETWEEN '$awal' AND '$akhir'
            AND p.is_aktif = '1' AND j.is_aktif='1'
            ";
    if ($id !== 'all') {
      $sql .= "AND a.pegawai_id = '$id'";
    }
    $data = DB::select($sql);
    return $data;
  }

  public function laporan(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $data = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    return response()->json(['msg' => 'Successfuly get data absen', "data" => $data, 'error' => []], 200);
  }

  public function export(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $cuti = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    $awal = date("Y-m-d", substr($periode->awal, 0, 10));
    $akhir = date("Y-m-d", substr($periode->akhir, 0, 10));
    return Excel::download(new ExportAbsen($cuti, $periode), 'absensi-laporan-' . $awal . '-' . $akhir . '.xlsx');
  }

  public function rekap(Request $request)
  {
    $last = date("t", strtotime($request->date));
    $yearMonth = date("Y-m-", strtotime($request->date));
    $data = $this->rekap_data($yearMonth, $last, $request->id);
    // foreach ($data[0] as $key => $value) {
    //   return $key;
    // }
    return response()->json(['msg' => 'Successfuly get data rekap absen', "data" => $data, 'error' => []], 200);
  }

  public function rekap_data($yearMonth, $lastday, $id)
  {
    $nullquery = '';
    $query1 = '';
    for ($i = 1; $i <= $lastday; $i++) {
			$date = date_create(date($yearMonth . $i));
			$ftgl = date_format($date, "Ymd");
			$query1 .= "IF(DATE_FORMAT(tanggal,'%Y%m%d')='$ftgl',keterangan,'Alpha') AS tgl_" . $i.",";
      $nullquery .= "'Alpha' AS tgl_".$i.",";
		}

    $sql_utama = "SELECT pegawais.`nama_pegawai`, ".$query1." absens.`pegawai_id` FROM absens
    INNER JOIN pegawais on pegawais.id_pegawai = absens.pegawai_id
    WHERE pegawai_id = '$id'";
    $count = Count(DB::select($sql_utama));
    if($count == 0) {
      $sql2 = "SELECT pegawais.`nama_pegawai`, ".$nullquery." pegawais.`id_pegawai` FROM pegawais
                  WHERE id_pegawai = '$id'";
      return DB::select($sql2);
    } else {
      return DB::select($sql_utama);
    }
  }
}
