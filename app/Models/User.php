<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
  use Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  // protected $fillable = [
  //     'username',
  //     'password',
  // ];
  protected $guarded = [];
  public $incrementing = false;
  public $timestamps = false;
  protected $primaryKey = 'id';
  protected $keyType = 'string';

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  // protected $casts = [
  //     'email_verified_at' => 'datetime',
  // ];

  // Rest omitted for brevity

  /**
   * Get the identifier that will be stored in the subject claim of the JWT.
   *
   * @return mixed
   */
  public function getJWTIdentifier()
  {
    return $this->getKey();
  }

  /**
   * Return a key value array, containing any custom claims to be added to the JWT.
   *
   * @return array
   */
  public function getJWTCustomClaims()
  {
    return [];
  }

  function pegawai() {
    return $this->hasOne(Pegawai::class, 'id_pegawai','pegawai_id');
  }
}
