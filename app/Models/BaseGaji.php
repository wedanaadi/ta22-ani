<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaseGaji extends Model
{
  use HasFactory;
  protected $table = 'mastergajis';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_master_gaji';
  protected $keyType = 'string';

  function jabatan() {
    return $this->belongsTo(Jabatan::class, 'jabatan_id', 'id_jabatan');
  }
}
