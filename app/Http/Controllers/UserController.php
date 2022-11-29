<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class UserController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api');
  }

  public function index()
  {
    $user = User::with('pegawai')->whereRelation('pegawai', 'is_aktif', "1")
            ->whereRelation('pegawai.jabatan', 'is_aktif', "1")
            ->get();
    return response()->json(['msg' => 'get all data', "data" => $user, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $req = $request->only([
      'username',
      'password',
      'pegawai_id',
      'hak_akses'
    ]);

    $validator = Validator::make($req, [
      'username' => 'required',
      'password' => 'required',
      'hak_akses' => 'required',
      'pegawai_id' => 'required'
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $check = User::where('pegawai_id',$request->pegawai_id)->get()->count();
    if($check>0) {
      return response()->json(['data' => [], 'error' => 'Pegawai sudah memiliki user'], 403);
    }

    DB::beginTransaction();
    try {
      $newID = Uuid::generate()->string;
      $payload = [
        'id' => $newID,
        'username' => $request->username,
        'password' => Hash::make($request->password),
        'pegawai_id' => $request->pegawai_id,
        'hak_akses' => $request->hak_akses,
        'created_at' => round(microtime(true) * 1000),
      ];

      User::create($payload);
      unset($payload['id_pegawai']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data user', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data user', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $req = $request->only([
      'username',
      'password',
      'pegawai_id',
      'hak_akses',
    ]);

    $validator = Validator::make($req, [
      'username' => 'required',
      // 'password' => 'required',
      'pegawai_id' => 'required'
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $check = User::where('pegawai_id',$request->pegawai_id)->get();
    if($check->count()>0 and $id !== $check[0]->id) {
      return response()->json(['data' => [], 'error' => 'Pegawai sudah memiliki user'], 403);
    }

    $userFind = User::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'username' => $request->username,
        'pegawai_id' => $request->pegawai_id,
        'hak_akses' => $request->hak_akses,
      ];

      if($request->password != '' OR $request->password != null) {
        $payload['password'] = Hash::make($request->password);
      }

      $userFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data user', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data user', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $userFind = User::findOrFail($id);
    DB::beginTransaction();
    try {
      $userFind->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data user', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data user', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function setting(Request $request)
  {
    $id_pegawai = $request->id_pegawai;
    $user = User::where('pegawai_id',$id_pegawai)->first();

    DB::beginTransaction();
    try {
      $payload = [
        'username' => $user->username
      ];

      if($request->password != '' OR $request->password != null) {
        $payload['password'] = Hash::make($request->password);
      }

      if($request->username != '' OR $request->username != null) {
        $payload['username'] = $request->username;
      }

      $user->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data user', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data user', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
