<?php

namespace App\Libraries;

class Fungsi {
  public static function KodeGenerate($lastKode, $lenght, $start, $awalKode = NULL, $split = NULL)
  {
    $kode = substr($lastKode, $start);
    $angka = (int)$kode;
    $angka_baru = $awalKode . $split . str_repeat("0", $lenght - strlen($angka + 1)) . ($angka + 1);
    return $angka_baru;
  }

  public static function GetAllDate($start, $end)
  {
    $rangeDate = [];
    $startDate = strtotime($start);
    $endDate = strtotime($end);

    for ($currentDate=$startDate; $currentDate <= $endDate; $currentDate+=(86400)) {
      $date = date('Y-m-d',$currentDate);

      $rangeDate[] = $date;
    }
    return $rangeDate;
  }
}
