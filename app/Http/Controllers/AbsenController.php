<?php

namespace App\Http\Controllers;

use App\Exports\ExportAbsen;
use App\Imports\ImportAbsen;
use App\Models\Absen;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Webpatser\Uuid\Uuid;

class AbsenController extends Controller
{
  public function index()
  {
    $absen = Absen::with('pegawai', 'pegawai.jabatan')->get();
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
        'tanggal' => $request->tanggal,
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
        'tanggal' => $request->tanggal,
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

  public function getPegawaiNotCuti(Request $request)
  {
    $now = $request->now;
    if($request->act === 'save') {
      $sql = "SELECT pegawais.*, pv2.pegawai_id FROM pegawais
              LEFT JOIN (
                SELECT absens.*, pv1.tanggal_mulai, pv1.tanggal_selesai FROM absens
                LEFT JOIN (
                SELECT * FROM cutis
                ) AS pv1 ON pv1.pegawai_id = absens.pegawai_id
                WHERE absens.tanggal >= '$now' OR pv1.tanggal_mulai <= '$now' AND pv1.tanggal_selesai >= '$now'
              ) AS pv2 ON pv2.pegawai_id = pegawais.id_pegawai
              WHERE pv2.pegawai_id IS NULL;";
    } else {
      $id = $request->id;
      $sql = "SELECT pegawais.*, pv2.pegawai_id FROM pegawais
              LEFT JOIN (
                SELECT absens.*, pv1.tanggal_mulai, pv1.tanggal_selesai FROM absens
                LEFT JOIN (
                SELECT * FROM cutis
                ) AS pv1 ON pv1.pegawai_id = absens.pegawai_id
                WHERE absens.tanggal = '$now' OR pv1.tanggal_mulai <= '$now' AND pv1.tanggal_selesai >= '$now'
              ) AS pv2 ON pv2.pegawai_id = pegawais.id_pegawai
              WHERE pv2.pegawai_id = '$id'";
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

  public function export()
  {
    $cuti = Absen::with('pegawai','pegawai.jabatan')->get();
    return Excel::download(new ExportAbsen($cuti), 'absensi-laporan-dicetak-'.date('Y-m-d').'.xlsx');
  }
}
