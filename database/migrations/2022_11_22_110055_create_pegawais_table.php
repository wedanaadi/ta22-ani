<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pegawais', function (Blueprint $table) {
          $table->string('id_pegawai')->primary();
          $table->string('nama_pegawai');
          $table->string('tempat_lahir');
          $table->integer('tanggal_lahir');
          $table->enum('jenis_kelamin',[0,1]);
          $table->string('alamat');
          $table->string('agama');
          $table->string('status');
          $table->string('pendidikan',50);
          $table->string('no_telepon',15);
          $table->string('foto');
          $table->string('jabatan_id');
          $table->enum('status_pegawai',[0,1]);
          $table->bigInteger('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pegawais');
    }
};
