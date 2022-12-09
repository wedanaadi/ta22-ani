<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kinerja extends Model
{
  use HasFactory;
  protected $table = 'kinerjas';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_kinerjas';
  protected $keyType = 'string';

  function pegawai()
  {
    return $this->belongsTo(Pegawai::class, 'pegawai_id','id_pegawai');
  }
}
