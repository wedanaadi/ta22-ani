<?php

namespace App\Http\Controllers;

use App\Exports\ExportPegawai;
use App\Libraries\Fungsi;
use App\Models\Jabatan;
use App\Models\Pegawai;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Webpatser\Uuid\Uuid;

class PegawaiController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['export']]);
  }

  public function index()
  {
    $pegawaiAll = Pegawai::with('jabatan')
      ->whereRelation('jabatan', 'is_aktif', "1")
      ->where('is_aktif', "1")->get();
    return response()->json(['msg' => 'get all data', "data" => $pegawaiAll, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $req = $request->only([
      'nik',
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
      'jabatan_id',
      'tanggal_bergabung'
    ]);
    $validator = Validator::make($req, [
      'nik' => 'required|numeric',
      'nama_pegawai' => 'required',
      'tempat_lahir' => 'required',
      'tanggal_lahir' => 'required',
      'jenis_kelamin' => 'required',
      'alamat' => 'required',
      'agama' => 'required',
      'status' => 'required',
      'pendidikan' => 'required',
      'tanggal_bergabung' => 'required',
      'no_telepon' => 'required',
      'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
      'jabatan_id' => 'required'
    ], [
      'required' =>  'The :attribute can not empty',
      'numeric' =>  'The :attribute must be number',
      'image' => 'File tidak valid',
      'mimes' => 'Format gambar harus jpeg/png/jpg',
      'max:2048' => 'Ukuran maksimal 2 MB'
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $date = date('y') . date('m');
      $lastKode = Pegawai::select(DB::raw('MAX(id_pegawai) AS kode'))
        ->where(DB::raw('SUBSTR(id_pegawai,2,4)'), $date)
        ->first();
      $newID = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'P', $date);
      $payload = [
        'id_pegawai' => $newID,
        'nik' => $request->nik,
        'nama_pegawai' => $request->nama_pegawai,
        'tempat_lahir' => $request->tempat_lahir,
        'tanggal_lahir' => date('Y-m-d', strtotime($request->tanggal_lahir)),
        'tanggal_bergabung' => date('Y-m-d', strtotime($request->tanggal_bergabung)),
        'jenis_kelamin' => $request->jenis_kelamin,
        'alamat' => $request->alamat,
        'agama' => $request->agama,
        'status' => $request->status,
        'status_pegawai' => "0",
        'pendidikan' => $request->pendidikan,
        'no_telepon' => $request->no_telepon,
        'jabatan_id' => $request->jabatan_id,
        'created_at' => round(microtime(true) * 1000),
        'kontrak_berakhir' => date('Y-m-d',strtotime($request->tanggal_bergabung."+1 years"))
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
      'nik',
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
      'jabatan_id',
      'tanggal_bergabung'
    ]);

    $validator = Validator::make($req, [
      'nik' => 'required',
      'nama_pegawai' => 'required',
      'tempat_lahir' => 'required',
      'tanggal_lahir' => 'required',
      'jenis_kelamin' => 'required',
      'alamat' => 'required',
      'agama' => 'required',
      'status' => 'required',
      'pendidikan' => 'required',
      'no_telepon' => 'required',
      'tanggal_bergabung' => 'required',
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
        'nik' => $request->nik,
        'tempat_lahir' => $request->tempat_lahir,
        'tanggal_lahir' => date('Y-m-d', strtotime($request->tanggal_lahir)),
        'tanggal_bergabung' => date('Y-m-d', strtotime($request->tanggal_bergabung)),
        'jenis_kelamin' => $request->jenis_kelamin,
        'alamat' => $request->alamat,
        'agama' => $request->agama,
        'status' => $request->status,
        // 'status_pegawai' => "0",
        'pendidikan' => $request->pendidikan,
        'no_telepon' => $request->no_telepon,
        'jabatan_id' => $request->jabatan_id,
        'kontrak_berakhir' => date('Y-m-d',strtotime($request->tanggal_bergabung."+1 years"))
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
        $payload['foto'] = $profileImage;
      }

      $pegawaiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data pegawai', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data pegawai', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $pegawaiFind = Pegawai::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0"
      ];

      $pegawaiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data pegawai', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data pegawai', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function getPegawaiNotHasUser(Request $request)
  {
    if ($request->act === 'save') {
      $data = DB::select("SELECT pegawais.*
    FROM pegawais
    LEFT JOIN users t2 ON t2.pegawai_id = pegawais.id_pegawai
    WHERE t2.pegawai_id IS NULL;");
    } else {
      $data = DB::select("SELECT pegawais.*
    FROM pegawais
    LEFT JOIN users t2 ON t2.pegawai_id = pegawais.id_pegawai
    WHERE t2.pegawai_id = '$request->id' or t2.pegawai_id IS NULL");
    }
    return response()->json(['msg' => 'Get pegawai Not Has User', "data" => $data, 'error' => []], 200);
  }

  public function getDataLaporan()
  {
    return Pegawai::with('jabatan')
    ->whereRelation('jabatan', 'is_aktif', "1")
    ->where('is_aktif','1')->get();
  }

  public function laporan(Request $request)
  {
    $data = $this->getDataLaporan();
    return response()->json(['msg' => 'Successfuly get data gaji', "data" => $data, 'error' => []], 200);
  }

  public function export()
  {
    $pegawaiAll = Pegawai::with('jabatan')->get();
    return Excel::download(new ExportPegawai($pegawaiAll), 'pegawai-laporan.xlsx');
  }

  public function kontrak(Request $request, $id)
  {
    $pegawaiFind = Pegawai::findOrFail($id);
    DB::beginTransaction();
    try {
      if($request->type === 'new') {
        $kb = Carbon::parse($pegawaiFind->kontrak_berakhir)->format('Y');
        $fixDate = $kb.Carbon::now()->format('-m-d');
        $jabatanTraining = Jabatan::where('nama_jabatan','Pegawai Kontrak')->select('id_jabatan')->firstOrFail();
        $payload = [
          'status_pegawai' => "1",
          'kontrak_berakhir' => date('Y-m-d',strtotime(Carbon::parse($fixDate)->format('Y-m-d')."+1 years"))
        ];
      } else {
        $payload = [
          'kontrak_berakhir' => date('Y-m-d',strtotime(Carbon::parse($pegawaiFind->kontrak_berakhir)->format('Y-m-d')."+1 years"))
        ];
      }
      return $payload;
      $pegawaiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data pegawai', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data pegawai', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
