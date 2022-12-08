<?php

namespace App\Http\Controllers;

use App\Models\BaseGaji;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class ListGajiController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api');
  }

  public function index()
  {
    $list = BaseGaji::with('jabatan')->get();
    return response()->json(['msg' => 'get all data', "data" => $list, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    // return $request->all();
    $validator = Validator::make($request->all(),[
      'nama_list' => 'required',
      'nama_jabatan' => 'required',
      'gaji_pokok' => 'required|numeric|gt:0',
      'tunjangan' => 'required|numeric',
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
        'id_master_gaji' => Uuid::generate()->string,
        'jabatan_id' => $request->nama_jabatan,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
        'nama_gaji' => $request->nama_list,
      ];
      BaseGaji::create($payload);
      unset($payload['id_master_gaji']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data list gaji', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data list gaji', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    // return $request->all();
    $validator = Validator::make($request->all(),[
      'nama_list' => 'required',
      'nama_jabatan' => 'required',
      'gaji_pokok' => 'required|numeric|gt:0',
      'tunjangan' => 'required|numeric',
    ],[
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be numeric',
      'gt' =>  'The :attribute must be greater than 0',
    ]);

    if($validator->fails()) {
      return response()->json(['data' => [],'error' => $validator->messages()->toArray()],422);
    }

    $find = BaseGaji::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'jabatan_id' => $request->nama_jabatan,
        'gaji_pokok' => $request->gaji_pokok,
        'tunjangan' => $request->tunjangan,
        'nama_gaji' => $request->nama_list,
      ];
      $find->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data list gaji', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail updated data list gaji', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $cutiFind = BaseGaji::findOrFail($id);
    DB::beginTransaction();
    try {
      $cutiFind->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data list', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data list', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
