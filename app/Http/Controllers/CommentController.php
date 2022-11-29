<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class CommentController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api');
  }

  public function index()
  {
    $absen = Comment::with('gaji', 'gaji.pegawai.jabatan')->where('is_read',"1")->get();
    return response()->json(['msg' => 'get all absen', "data" => $absen, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'comment' => 'required',
      'gaji_id' => 'required',
    ], [
      'required' =>  'The :attribute can not empty',
    ]);

    if ($validator->fails()) {
      return response()->json(['data' => [], 'error' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id_comment' => Uuid::generate()->string,
        'comment' => $request->comment,
        'gaji_id' => $request->gaji_id,
        'pegawai_id' => $request->pegawai_id,
        'created_at' => round(microtime(true) * 1000),
      ];
      Comment::create($payload);
      $commentPrev = Comment::where('gaji_id', $request->gaji_id)
      ->where('is_read', 0)
      ->where('pegawai_id', '!=', $request->pegawai_id)->count();
      if($commentPrev > 0) {
        Comment::where('gaji_id',$request->gaji_id)
        ->where('pegawai_id','!=',$request->pegawai_id)
        ->update(['is_read'=>1]);
      }
      unset($payload['id_comment']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data jabatan', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $commentFind = Comment::findOrFail($id);
    DB::beginTransaction();
    try {
      $commentFind->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data comment', "data" => [], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data comment', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function check($id)
  {
    $count = Comment::where('gaji_id', $id)->count();
    return response()->json(['msg' => 'Successfuly get data comment', "data" => $count, 'error' => []], 200);
  }

  public function getComment($id)
  {
    $sql = "SELECT c.*, p.nama_pegawai FROM `comments` c
            INNER JOIN pegawais p on p.id_pegawai = c.pegawai_id
            WHERE c.gaji_id = '$id'
            ORDER by created_at DESC";
    $comment = DB::select($sql);
    return response()->json(['msg' => 'get all absen', "data" => $comment, 'error' => []], 200);
  }

  public function getComment2()
  {
    $sql = "SELECT g.*, p.nama_pegawai, p.nik FROM gajis g
            INNER JOIN comments c ON c.gaji_id = g.id_gaji
            INNER JOIN pegawais p ON p.id_pegawai = g.pegawai_id
            GROUP BY g.id_gaji;";
    $data = DB::select($sql);

    return response()->json(['msg' => 'get all absen', "data" => $data, 'error' => []], 200);
  }
}
