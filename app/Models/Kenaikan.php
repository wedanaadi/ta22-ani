<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kenaikan extends Model
{
  use HasFactory;
  protected $table = 'kenaikans';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_kenaikan';
  protected $keyType = 'string';

  function pegawai()
  {
    return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id_pegawai');
  }
}
