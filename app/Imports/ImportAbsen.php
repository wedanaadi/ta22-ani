<?php

namespace App\Imports;

use App\Models\Absen;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Webpatser\Uuid\Uuid;

class ImportAbsen implements ToModel, WithStartRow
{
  public function startRow() : int
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
        return new Absen([
            'id_absen' => Uuid::generate()->string,
            'pegawai_id' => $row[0],
            'tanggal' => Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[1])),
            'keterangan' => $row[2],
            'created_at' => round(microtime(true) * 1000),
        ]);
    }
}
