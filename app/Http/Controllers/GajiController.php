<?php

namespace App\Http\Controllers;

use App\Models\Gaji;
use App\Models\Pegawai;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class GajiController extends Controller
{
  public function index()
  {
    $jabatanAll = Gaji::with('pegawai','pegawai.jabatan')->get();
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
    $validator = Validator::make($request->all(),[
      'pegawai_id' => 'required',
      'month' => 'required',
    ],[
      'required' =>  'The :attribute can not empty',
    ]);

    if($validator->fails()) {
      return response()->json(['data' => [],'error' => $validator->messages()->toArray()],422);
    }

    $pegawaiId = $request->pegawai_id;
    $moth = json_decode($request->month);
    $dateAwal = $moth->awal;
    $dateAkhir = $moth->akhir;
    $sqlKehadiran = "select count(id_absen) as 'kehadiran' from absens
    WHERE keterangan = 'Hadir' AND pegawai_id = '$pegawaiId'
    AND tanggal BETWEEN '$dateAwal' and '$dateAkhir';";
    $kehadiran = DB::select($sqlKehadiran)[0]->kehadiran;

    $dayOfMonth = date("t", substr($dateAwal, 0, 10));

    $pegawai = Pegawai::find($pegawaiId);

    $data = [
      'atas' => [
        'nama' => $pegawai->nama_pegawai,
        'jabatan' => $pegawai->jabatan->nama_jabatan,
        'dayofmonth' =>$dayOfMonth,
        'kehadiran' => $kehadiran,
        'offday' => $dayOfMonth - $kehadiran -4,
        'gaji_pokok' => $pegawai->jabatan->gaji_pokok,
        'tunjangan' => $pegawai->jabatan->tunjangan,
      ],
      'bawah' => [
        'gaji_pokok_harian' => $pegawai->jabatan->gaji_pokok/($dayOfMonth - 4),
        'tunjangan_harian' => $pegawai->jabatan->tunjangan/($dayOfMonth - 4),
        'total_pokok_harian' => ($pegawai->jabatan->gaji_pokok/($dayOfMonth - 4)) * $kehadiran,
        'total_tunjangan_harian' => ($pegawai->jabatan->tunjangan/($dayOfMonth - 4)) * $kehadiran,
      ]
    ];

    return response()->json(['data' => $data, 'error' => []], 200);
  }

  public function getPegawaiNonGaji(Request $request)
  {
    $periode = $request->periode;
    $id = $request->id;
    if ($request->act === 'save') {
      $sql = "SELECT t1.*, pivot1.pegawai_id from pegawais t1
              LEFT JOIN (
              SELECT * FROM gajis
              WHERE periode = '$periode'
              ) AS pivot1 ON pivot1.pegawai_id = t1.id_pegawai
              WHERE pivot1.pegawai_id IS NULL";
    } else {
      $sql = "SELECT t1.*, pivot1.pegawai_id from pegawais t1
              LEFT JOIN (
              SELECT * FROM gajis
              WHERE periode = '$periode'
              ) AS pivot1 ON pivot1.pegawai_id = t1.id_pegawai
              WHERE pivot1.pegawai_id IS NULL OR pivot1.pegawai_id = '$id'";
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
}