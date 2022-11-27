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
  public function index()
  {
    $absen = Comment::with('gaji', 'gaji.pegawai.jabatan')->get();
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
        'created_at' => round(microtime(true) * 1000),
      ];
      Comment::create($payload);
      unset($payload['id_comment']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data jabatan', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data jabatan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function check($id)
  {
    $count = Comment::where('gaji_id',$id)->count();
    return response()->json(['msg' => 'Successfuly get data comment', "data" => $count, 'error' => []], 200);
  }
}
