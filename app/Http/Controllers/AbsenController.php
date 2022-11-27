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

  public function getPegawaiNotCuti(Request $request)
  {
    $now = $request->now;
    if ($request->act === 'save') {
      $sql = "SELECT * FROM pegawais p
              LEFT JOIN (
                SELECT pv1.pegawai_id FROM absens
                RIGHT JOIN (
                  SELECT * FROM cutis
                ) AS pv1 ON pv1.pegawai_id = absens.pegawai_id
                WHERE (UNIX_TIMESTAMP(absens.tanggal) * 1000) >= '$now' OR (UNIX_TIMESTAMP(pv1.tanggal_mulai) * 1000) <= '$now' AND (UNIX_TIMESTAMP(pv1.tanggal_selesai) * 1000) >= '$now'
              ) AS pv2 on pv2.pegawai_id = p.id_pegawai
              WHERE pv2.pegawai_id IS NULL;";
    } else {
      $id = $request->id;
      $sql = "SELECT * FROM pegawais p
              LEFT JOIN (
                SELECT pv1.pegawai_id FROM absens
                RIGHT JOIN (
                  SELECT * FROM cutis
                ) AS pv1 ON pv1.pegawai_id = absens.pegawai_id
                WHERE (UNIX_TIMESTAMP(pv1.tanggal_mulai) * 1000) <= '$now' AND (UNIX_TIMESTAMP(pv1.tanggal_selesai) * 1000) >= '$now'
              ) AS pv2 on pv2.pegawai_id = p.id_pegawai
              WHERE pv2.pegawai_id IS NULL;";
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
            ";
    if($id!=='all') {
      $sql.= "AND a.pegawai_id = '$id'";
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
    return Excel::download(new ExportAbsen($cuti,$periode), 'absensi-laporan-'.$awal.'-'.$akhir.'.xlsx');
  }
}
