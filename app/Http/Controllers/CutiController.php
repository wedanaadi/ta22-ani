<?php

namespace App\Http\Controllers;

use App\Models\Cuti;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class CutiController extends Controller
{
  public function index()
  {
    $user = Cuti::with('pegawai')->get();
    return response()->json(['msg' => 'get all cuti', "data" => $user, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(),[
      'tanggal_mulai' => 'required',
      'tanggal_selesai' => 'required',
      'pegawai_id' => 'required',
      'alasan' => 'required',
    ],[
      'required' =>  'The :attribute can not empty',
    ]);

    if($validator->fails()) {
      return response()->json(['data' => [],'error' => $validator->messages()->toArray()],422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_cuti' => Uuid::generate()->string,
        'tanggal_mulai' => $request->tanggal_mulai,
        'tanggal_selesai' => $request->tanggal_selesai,
        'alasan' => $request->alasan,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
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
    $validator = Validator::make($request->all(),[
      'tanggal_mulai' => 'required',
      'tanggal_selesai' => 'required',
      'pegawai_id' => 'required',
      'alasan' => 'required',
    ],[
      'required' =>  'The :attribute can not empty',
    ]);

    if($validator->fails()) {
      return response()->json(['data' => [],'error' => $validator->messages()->toArray()],422);
    }

    $cutiFind = Cuti::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'id_cuti' => Uuid::generate()->string,
        'tanggal_mulai' => $request->tanggal_mulai,
        'tanggal_selesai' => $request->tanggal_selesai,
        'alasan' => $request->alasan,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
      ];
      $cutiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data cuti', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data cuti', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
