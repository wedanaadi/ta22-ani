<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuti extends Model
{
  use HasFactory;
  protected $table = 'cutis';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_cuti';
  protected $keyType = 'string';

  function pegawai()
  {
    return $this->hasOne(Pegawai::class, 'id_pegawai','pegawai_id');
  }
}
