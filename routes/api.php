<?php

use App\Http\Controllers\AbsenController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CutiController;
use App\Http\Controllers\GajiController;
use App\Http\Controllers\JabatanController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('refresh', [AuthController::class, 'refresh']);

Route::post('setting',[UserController::class,'setting']);

Route::middleware('api')->group(function () {
  Route::get('me', [AuthController::class, 'me']);
  Route::get('hello', [AuthController::class, 'hello']);
  Route::post('logout', [AuthController::class, 'logout']);
  // jabatan
  Route::get('jabatan', [JabatanController::class, 'index']);
  Route::post('jabatan', [JabatanController::class, 'store']);
  Route::put('jabatan/{id}', [JabatanController::class, 'update']);
  // pegawai
  Route::get('pegawai', [PegawaiController::class, 'index']);
  Route::get('pegawai-user', [PegawaiController::class, 'getPegawaiNotHasUser']);
  Route::post('pegawai', [PegawaiController::class, 'store']);
  Route::put('pegawai/{id}', [PegawaiController::class, 'update']);
  // user
  Route::get('user', [UserController::class, 'index']);
  Route::post('user', [UserController::class, 'store']);
  Route::put('user/{id}', [UserController::class, 'update']);
  // cuti
  Route::get('cuti', [CutiController::class, 'index']);
  Route::post('cuti', [CutiController::class, 'store']);
  Route::put('cuti/{id}', [CutiController::class, 'update']);
  // absen
  Route::get('absen', [AbsenController::class, 'index']);
  Route::get('pegawai-absen', [AbsenController::class, 'getPegawaiNotCuti']);
  Route::post('absen', [AbsenController::class, 'store']);
  Route::put('absen/{id}', [AbsenController::class, 'update']);
  // laporan
  Route::post('absen/import', [AbsenController::class, 'import']);
  Route::get('pegawai/export', [PegawaiController::class, 'export']);
  Route::get('cuti/export', [CutiController::class, 'export']);
  Route::get('absen/export', [AbsenController::class, 'export']);
  Route::get('gaji/export', [GajiController::class, 'export']);
  Route::get('slip/export/{id}', [GajiController::class, 'exportSlip']);

  Route::get('laporan-cuti', [CutiController::class, 'laporan']);
  Route::get('laporan-absen', [AbsenController::class, 'laporan']);
  Route::get('laporan-gaji', [GajiController::class, 'laporan']);
  Route::get('laporan-pegawai', [PegawaiController::class, 'laporan']);
  // gaji
  Route::get('gaji', [GajiController::class, 'index']);
  Route::get('hitung-gaji', [GajiController::class, 'getGaji']);
  Route::get('pegawai-gaji', [GajiController::class, 'getPegawaiNonGaji']);
  Route::get('pegawai-slip', [GajiController::class, 'pegawai_slip']);
  Route::post('gaji', [GajiController::class, 'store']);
  Route::put('gaji/{id}', [GajiController::class, 'update']);
  Route::put('validasi/{id}', [GajiController::class, 'validasi']);
  // comment
  Route::get('comment-list', [CommentController::class, 'getComment2']);
  Route::get('comment-by/{id}', [CommentController::class, 'getComment']);
  Route::get('comment', [CommentController::class, 'index']);
  Route::get('check/{id}', [CommentController::class, 'check']);
  Route::post('comment', [CommentController::class, 'store']);
});
