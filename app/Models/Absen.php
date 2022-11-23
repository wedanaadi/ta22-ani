<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absen extends Model
{
  use HasFactory;
  protected $table = 'absens';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_absen';
  protected $keyType = 'string';

  function pegawai() {
    return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id_pegawai');
  }
}
