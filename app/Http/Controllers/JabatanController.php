<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class JabatanController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api');
  }

  public function index()
  {
    $jabatanAll = Jabatan::where('is_aktif',"1")->get();
    return response()->json(['msg' => 'get all data', "data" => $jabatanAll, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    // return $request->all();
    $validator = Validator::make($request->all(),[
      'nama_jabatan' => 'required',
      'gaji_pokok' => 'required|numeric|gt:0',
      'tunjangan' => 'required|numeric|gt:0',
    ],[
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be numeric',
      'gt' =>  'The :attribute must be greater than 0',
    ]);

    if($validator->fails()) {
      return response()->json(['data' => [],'error' => $validator->messages()->toArray()],422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_jabatan' => Uuid::generate()->string,
        'nama_jabatan' => $request->nama_jabatan,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
        'created_at' => round(microtime(true) * 1000),
      ];
      Jabatan::create($payload);
      unset($payload['id_jabatan']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data jabatan', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(),[
      'nama_jabatan' => 'required',
      'gaji_pokok' => 'required|numeric|gt:0',
      'tunjangan' => 'required|numeric|gt:0',
    ],[
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be numeric',
      'gt' =>  'The :attribute must be greater than 0',
    ]);

    if($validator->fails()) {
      return response()->json(['error' => $validator->messages()->toArray()],422);
    }

    $jabatanFind = Jabatan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'nama_jabatan' => $request->nama_jabatan,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
      ];
      $jabatanFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data jabatan', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $jabatanFind = Jabatan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0"
      ];

      $jabatanFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data jabatan', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
