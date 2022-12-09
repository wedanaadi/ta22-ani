<?php

namespace App\Http\Controllers;

use App\Models\Kenaikan;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Webpatser\Uuid\Uuid;

class KenaikanController extends Controller
{
  public function index(Request $request)
  {
    $role = $request->role;
    if ((int)$role === 2) {
      $sql = "select * from (
                SELECT pegawais.`id_pegawai`,pegawais.`nama_pegawai`, datediff(now(), pegawais.`tanggal_bergabung`)/ 365.24 as 'masa_kerja',
                  year(now()) as 'tahun',users.`hak_akses`
                  FROM pegawais
                  LEFT JOIN (
                    SELECT * FROM kenaikans WHERE tahun = YEAR(NOW())
                  ) AS naik ON naik.`pegawai_id` = pegawais.`id_pegawai`
                  INNER JOIN users on users.`pegawai_id` = pegawais.`id_pegawai`
                  WHERE naik.`id_kenaikan` IS NULL
                  AND datediff(now(), pegawais.`tanggal_bergabung`)/ 365.24 >= '1'
                  AND pegawais.`is_aktif` = '1' AND pegawais.`status_pegawai` = '1'
                ) AS tb
              WHERE hak_akses = '3' OR hak_akses = '1'";
    } else {
      $sql = "select * from (
        SELECT pegawais.`id_pegawai`,pegawais.`nama_pegawai`, datediff(now(), pegawais.`tanggal_bergabung`)/ 365.24 as 'masa_kerja',
          year(now()) as 'tahun',users.`hak_akses`
          FROM pegawais
          LEFT JOIN (
            SELECT * FROM kenaikans WHERE tahun = YEAR(NOW())
          ) AS naik ON naik.`pegawai_id` = pegawais.`id_pegawai`
          INNER JOIN users on users.`pegawai_id` = pegawais.`id_pegawai`
          WHERE naik.`id_kenaikan` IS NULL
          AND datediff(now(), pegawais.`tanggal_bergabung`)/ 365.24 >= '1'
          AND pegawais.`is_aktif` = '1' AND pegawais.`status_pegawai` = '1'
        ) AS tb
      WHERE hak_akses = '2'";
    }
    $data = DB::select($sql);
    return response()->json(['msg' => 'Get pegawai Not Has User', "data" => $data, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    DB::beginTransaction();
    try {
      $payload = [
        'id_kenaikan' => Uuid::generate()->string,
        'pegawai_id' => $request->id,
        'tahun' => $request->tahun,
        'is_status' => $request->status,
        'created_at' => round(microtime(true) * 1000),
      ];
      Kenaikan::create($payload);
      unset($payload['id_kenaikan']);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data kenaikan', "data" => $payload, 'error' => []], 201);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail created data kenaikan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
