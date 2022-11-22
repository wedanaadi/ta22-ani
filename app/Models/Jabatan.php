<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
  use HasFactory;
  protected $table = 'jabatans';
  public $incrementing = false;
  public $timestamps = false;
  protected $guarded = [];
  protected $primaryKey = 'id_jabatan';
  protected $keyType = 'string';

  // protected $hidden = [
  //   'id_jabatan',
  // ];

}
