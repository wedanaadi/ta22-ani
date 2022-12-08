<?php

namespace App\Http\Controllers;

use App\Exports\exportCuti;
use App\Models\Cuti;
use App\Models\Pegawai;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Webpatser\Uuid\Uuid;

class CutiController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['export']]);
  }

  public function index(Request $request)
  {
    if($request->role==2) {
      $user = Cuti::with('pegawai')
        ->whereRelation('pegawai', 'is_aktif', "1")
        ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
        ->get();
      } elseif($request->role==3){
        $user = Cuti::with('pegawai')
          ->whereRelation('pegawai', 'is_aktif', "1")
          ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
          ->where('pegawai_id',$request->id)
          ->get();
      }else {
        $user = Cuti::with('pegawai')
          ->whereRelation('pegawai', 'is_aktif', "1")
          ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
          ->get();
    }
    return response()->json(['msg' => 'get all cuti', "data" => $user, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'tanggal_mulai' => 'required',
      'tanggal_selesai' => 'required',
      'pegawai_id' => 'required',
      'alasan' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_cuti' => Uuid::generate()->string,
        'tanggal_mulai' => Carbon::parse($request->tanggal_mulai)->format('Y-m-d'),
        'tanggal_selesai' => Carbon::parse($request->tanggal_selesai)->format('Y-m-d'),
        'alasan' => $request->alasan,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
        'is_aprove' => $request->is_aprove,
      ];
      Cuti::create($payload);
      unset($payload['id_cuti']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data cuti', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data cuti', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'tanggal_mulai' => 'required',
      'tanggal_selesai' => 'required',
      'pegawai_id' => 'required',
      'alasan' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $cutiFind = Cuti::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'tanggal_mulai' => Carbon::parse($request->tanggal_mulai)->format('Y-m-d'),
        'tanggal_selesai' => Carbon::parse($request->tanggal_selesai)->format('Y-m-d'),
        'alasan' => $request->alasan,
        'pegawai_id' => $request->pegawai_id,
        'is_aprove' => $request->is_aprove
      ];
      $cutiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data cuti', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data cuti', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function approveOrReject(Request $request, $id)
  {
    $cutiFind = Cuti::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aprove' => $request->is_aprove
      ];
      $cutiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data cuti', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data cuti', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $cutiFind = Cuti::findOrFail($id);
    DB::beginTransaction();
    try {
      $cutiFind->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data cuti', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data cuti', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function getDataLaporan($id, $awal, $akhir)
  {
    $sql = "SELECT c.*, p.nama_pegawai, p.nik, j.nama_jabatan FROM cutis c
            INNER JOIN pegawais p on p.id_pegawai = c.pegawai_id
            INNER JOIN jabatans j on j.id_jabatan = p.jabatan_id
            WHERE (UNIX_TIMESTAMP(c.tanggal_mulai)*1000) >= '$awal'
            AND (UNIX_TIMESTAMP(c.tanggal_selesai)*1000) <= '$akhir'
            AND p.is_aktif = '1' AND j.is_aktif='1'
            ";
    if ($id !== 'all') {
      $sql .= "AND c.pegawai_id = '$id'";
    }
    $data = DB::select($sql);
    return $data;
  }

  public function laporan(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $data = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    return response()->json(['msg' => 'Successfuly get data cuti', "data" => $data, 'error' => []], 200);
  }

  public function export(Request $request)
  {
    $id = $request->pegawai_id;
    $periode = json_decode($request->periode);
    $cuti = $this->getDataLaporan($id, $periode->awal, $periode->akhir);
    $awal = date("Y-m-d", substr($periode->awal, 0, 10));
    $akhir = date("Y-m-d", substr($periode->akhir, 0, 10));
    return Excel::download(new exportCuti($cuti, $periode), 'cuti-laporan-' . $awal . '-' . $akhir . '.xlsx');
  }

  public function masakerja(Request $request)
  {
    $pegawai = Pegawai::find($request->id);
    $now = Carbon::now()->format('Y-m-d');
    $bergabung = Carbon::parse($pegawai->tanggal_bergabung)->format('Y-m-d');
    $diff = abs(strtotime($now) - strtotime($bergabung));
    $years = floor($diff / (365*60*60*24));
    $months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24));
    $days = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
    if($years >= 1) {
      $act = "allow";
    } else {
      $act = "notAllow";
    }
    return ['data' => $act];
  }
}
