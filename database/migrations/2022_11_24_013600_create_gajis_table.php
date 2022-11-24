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
        Schema::create('gajis', function (Blueprint $table) {
          $table->string('id_absen')->primary();
          $table->string('bulan');
          $table->string('pegawai_id');
          $table->integer('total_hadir');
          $table->integer('gaji_pokok');
          $table->integer('gaji_harian');
          $table->integer('tunjangan');
          $table->integer('bonus');
          $table->integer('potongan');
          $table->integer('total');
          $table->integer('is_valid')->default(0);
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
        Schema::dropIfExists('gajis');
    }
};
