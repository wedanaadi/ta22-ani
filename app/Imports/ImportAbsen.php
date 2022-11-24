<?php

namespace App\Imports;

use App\Models\Absen;
use Maatwebsite\Excel\Concerns\ToModel;
use Webpatser\Uuid\Uuid;

class ImportAbsen implements ToModel
{
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
            'tanggal' => $row[1],
            'keterangan' => $row[2],
            'created_at' => round(microtime(true) * 1000),
        ]);
    }
}
