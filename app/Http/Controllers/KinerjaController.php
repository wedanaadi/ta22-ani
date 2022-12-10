<?php

namespace App\Http\Controllers;

use App\Models\Kinerja;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class KinerjaController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api');
  }

  public function index()
  {
    $kinerja = [];
    $data = Kinerja::with('pegawai')
      ->whereRelation('pegawai', 'is_aktif', "1")
      ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
      ->get();
    foreach ($data as $d) {
      $kinerja[] = [
        'id_kinerjas' => $d['id_kinerjas'],
        'pegawai_id' => $d['pegawai_id'],
        'nama_pegawai' => $d['pegawai']['nama_pegawai'],
        'periode' => $d['periode'],
        'status' => $d['status'],
        'desc' => $d['desc'],
      ];
    }
    return response()->json(['msg' => 'get all data', "data" => $kinerja, 'error' => []], 200);
  }

  public function show($id)
  {
    $kinerja = [];
    $data = Kinerja::with('pegawai')
      ->whereRelation('pegawai', 'is_aktif', "1")
      ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
      ->where('pegawai_id',$id)
      ->get();
    foreach ($data as $d) {
      $kinerja[] = [
        'id_kinerjas' => $d['id_kinerjas'],
        'pegawai_id' => $d['pegawai_id'],
        'nama_pegawai' => $d['pegawai']['nama_pegawai'],
        'periode' => $d['periode'],
        'status' => $d['status'],
        'desc' => $d['desc'],
      ];
    }
    return response()->json(['msg' => 'get all data', "data" => $kinerja, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    // return $request->all();
    $validator = Validator::make($request->all(), [
      'pegawai_id' => 'required',
      'periode' => 'required',
      'desc' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
      'pegawai_id.required' =>  'The Nama Pegawai can not empty',
      'desc.required' =>  'The :Deskripsi can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_kinerjas' => Uuid::generate()->string,
        'pegawai_id' => $request->pegawai_id,
        'desc' => $request->desc,
        'periode' => $request->periode,
        'created_at' => round(microtime(true) * 1000),
      ];
      Kinerja::create($payload);
      unset($payload['id_kinerja']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data kinerja', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data kinerja', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request,$id)
  {
    // return $request->all();
    $validator = Validator::make($request->all(), [
      'pegawai_id' => 'required',
      'periode' => 'required',
      'desc' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
      'pegawai_id.required' =>  'The Nama Pegawai can not empty',
      'desc.required' =>  'The :Deskripsi can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $find = Kinerja::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'pegawai_id' => $request->pegawai_id,
        'desc' => $request->desc,
        'periode' => $request->periode,
      ];
      $find->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data kinerja', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data kinerja', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {

    $find = Kinerja::findOrFail($id);
    DB::beginTransaction();
    try {
      $find->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data kinerja', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data kinerja', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function updateStatus(Request $request,$id)
  {
    $find = Kinerja::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'status' => $request->status,
      ];
      $find->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data kinerja', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data kinerja', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
