<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class PegawaiController extends Controller
{
  public function index()
  {
    $pegawaiAll = Pegawai::with('jabatan')->get();
    return response()->json(['msg' => 'get all data', "data" => $pegawaiAll, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $req = $request->only([
      'nama_pegawai',
      'tempat_lahir',
      'tanggal_lahir',
      'jenis_kelamin',
      'alamat',
      'agama',
      'status',
      'pendidikan',
      'no_telepon',
      'foto',
      'jabatan_id'
    ]);
    $validator = Validator::make($req, [
      'nama_pegawai' => 'required',
      'tempat_lahir' => 'required',
      'tanggal_lahir' => 'required',
      'jenis_kelamin' => 'required',
      'alamat' => 'required',
      'agama' => 'required',
      'status' => 'required',
      'pendidikan' => 'required',
      'no_telepon' => 'required',
      'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
      'jabatan_id' => 'required'
    ], [
      'required' =>  'The :attribute can not empty',
      'image' => 'File tidak valid',
      'mimes' => 'Format gambar harus jpeg/png/jpg',
      'max:2048' => 'Ukuran maksimal 2 MB'
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $newID = Uuid::generate()->string;
      $payload = [
        'id_pegawai' => $newID,
        'nama_pegawai' => $request->nama_pegawai,
        'tempat_lahir' => $request->tempat_lahir,
        'tanggal_lahir' => $request->tanggal_lahir,
        'jenis_kelamin' => $request->jenis_kelamin,
        'alamat' => $request->alamat,
        'agama' => $request->agama,
        'status' => $request->status,
        'pendidikan' => $request->pendidikan,
        'no_telepon' => $request->no_telepon,
        'jabatan_id' => $request->jabatan_id,
        'created_at' => round(microtime(true) * 1000),
      ];

      if ($request->foto) {
        $dataImage = $request->foto;
        $destinationPath = 'images/pegawai';
        $profileImage = $newID . "=" . $dataImage->getClientOriginalName();
        $dataImage->move($destinationPath, $profileImage);
        $payload['foto'] = $profileImage;
      }

      Pegawai::create($payload);
      unset($payload['id_pegawai']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data jabatan', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $req = $request->only([
      'nama_pegawai',
      'tempat_lahir',
      'tanggal_lahir',
      'jenis_kelamin',
      'alamat',
      'agama',
      'status',
      'pendidikan',
      'no_telepon',
      'foto',
      'jabatan_id'
    ]);

    $validator = Validator::make($req, [
      'nama_pegawai' => 'required',
      'tempat_lahir' => 'required',
      'tanggal_lahir' => 'required',
      'jenis_kelamin' => 'required',
      'alamat' => 'required',
      'agama' => 'required',
      'status' => 'required',
      'pendidikan' => 'required',
      'no_telepon' => 'required',
      'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
      'jabatan_id' => 'required'
    ], [
      'required' =>  'The :attribute can not empty',
      'image' => 'File tidak valid',
      'mimes' => 'Format gambar harus jpeg/png/jpg',
      'max:2048' => 'Ukuran maksimal 2 MB'
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    $pegawaiFind = Pegawai::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'nama_pegawai' => $request->nama_pegawai,
        'tempat_lahir' => $request->tempat_lahir,
        'tanggal_lahir' => $request->tanggal_lahir,
        'jenis_kelamin' => $request->jenis_kelamin,
        'alamat' => $request->alamat,
        'agama' => $request->agama,
        'status' => $request->status,
        'pendidikan' => $request->pendidikan,
        'no_telepon' => $request->no_telepon,
        'jabatan_id' => $request->jabatan_id,
      ];

      if ($request->foto) {
        $dataImage = $request->foto;
        if ($request->oldFoto !== null) {
            $splitFoto = explode('=', $request->oldFoto);
            if ($dataImage->getClientOriginalName() !== $splitFoto[1]) {
                unlink('images/pegawai/' . $request->oldFoto);
            }
        }
        $destinationPath = 'images/pegawai';
        $profileImage = $id . "=" . $dataImage->getClientOriginalName();
        $dataImage->move($destinationPath, $profileImage);
        $data['foto'] = $profileImage;
    }

      $pegawaiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data jabatan', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
