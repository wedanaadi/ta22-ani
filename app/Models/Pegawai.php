<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
  use HasFactory;
  protected $table = 'pegawais';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_pegawai';
  protected $keyType = 'string';

  // protected $hidden = [
  //   'id_pegawai',
  // ];

  function jabatan() {
    return $this->belongsTo(Jabatan::class, 'jabatan_id', 'id_jabatan');
  }
}
