<?php

namespace App\Imports;

use App\Models\Absen;
use App\Models\Cuti;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Webpatser\Uuid\Uuid;

class ImportAbsen implements ToModel, WithStartRow
{
  public function startRow(): int
  {
    return 2;
  }
  /**
   * @param array $row
   *
   * @return \Illuminate\Database\Eloquent\Model|null
   */
  public function model(array $row)
  {
    $tglConvert = Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[1]));
    $check = Absen::where('pegawai_id', $row[0])->where('tanggal', $tglConvert);
    if ($check->count() > 0) {
      $check->update([
        'keterangan' => $row[2],
        'created_at' => round(microtime(true) * 1000),
      ]);
    } else {
      $sql = "SELECT COUNT(id_cuti) AS 'count' FROM cutis c
              WHERE (UNIX_TIMESTAMP(tanggal_mulai) * 1000) <= '".(\strtotime($tglConvert) * 1000)."'
              AND (UNIX_TIMESTAMP(tanggal_selesai) * 1000) >= '".(\strtotime($tglConvert) * 1000)."'
              AND pegawai_id = '$row[0]'
             ";
      $exec = DB::select($sql)[0];
      if($exec->count === 0) {
        return new Absen([
          'id_absen' => Uuid::generate()->string,
          'pegawai_id' => $row[0],
          'tanggal' => Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[1])),
          'keterangan' => $row[2],
          'created_at' => round(microtime(true) * 1000),
        ]);
      }
    }
  }
}
