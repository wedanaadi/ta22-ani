<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gaji extends Model
{
  use HasFactory;
  protected $table = 'gajis';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_gaji';
  protected $keyType = 'string';

  function pegawai()
  {
    return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id_pegawai');
  }
}
