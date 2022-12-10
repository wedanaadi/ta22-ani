<?php

use App\Http\Controllers\AbsenController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CutiController;
use App\Http\Controllers\GajiController;
use App\Http\Controllers\JabatanController;
use App\Http\Controllers\KenaikanController;
use App\Http\Controllers\KinerjaController;
use App\Http\Controllers\ListGajiController;
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
  Route::delete('jabatan/{id}',[JabatanController::class, 'destroy']);
   // list Gaji
   Route::get('list-gaji', [ListGajiController::class, 'index']);
   Route::post('list', [ListGajiController::class, 'store']);
   Route::put('list/{id}', [ListGajiController::class, 'update']);
   Route::delete('list/{id}',[ListGajiController::class, 'destroy']);
  // pegawai
  Route::get('pegawai', [PegawaiController::class, 'index']);
  Route::get('pegawai-user', [PegawaiController::class, 'getPegawaiNotHasUser']);
  Route::get('pegawai-kinerja', [PegawaiController::class, 'getPegawaiForKinerja']);
  Route::post('pegawai', [PegawaiController::class, 'store']);
  Route::put('pegawai/{id}', [PegawaiController::class, 'update']);
  Route::put('kontrak-pegawai/{id}', [PegawaiController::class, 'kontrak']);
  Route::delete('pegawai/{id}',[PegawaiController::class, 'destroy']);
  // user
  Route::get('user', [UserController::class, 'index']);
  Route::post('user', [UserController::class, 'store']);
  Route::put('user/{id}', [UserController::class, 'update']);
  Route::delete('user/{id}',[UserController::class, 'destroy']);
  // cuti
  Route::get('cuti', [CutiController::class, 'index']);
  Route::get('cek-masakerja', [CutiController::class, 'masakerja']);
  Route::post('cuti', [CutiController::class, 'store']);
  Route::put('cuti/{id}', [CutiController::class, 'update']);
  Route::delete('cuti/{id}',[CutiController::class, 'destroy']);
  Route::put('approve-reject/{id}', [CutiController::class, 'approveOrReject']);
  // absen
  Route::get('absen', [AbsenController::class, 'index']);
  Route::get('pegawai-absen', [AbsenController::class, 'getPegawaiNotCuti']);
  Route::post('absen', [AbsenController::class, 'store']);
  Route::put('absen/{id}', [AbsenController::class, 'update']);
  Route::delete('absen/{id}',[AbsenController::class, 'destroy']);
  Route::get('rekap-absen',[AbsenController::class,'rekap']);
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
  Route::delete('gaji/{id}',[GajiController::class, 'destroy']);
  // comment
  Route::get('comment-list', [CommentController::class, 'getComment2']);
  Route::get('comment-by/{id}', [CommentController::class, 'getComment']);
  Route::get('comment', [CommentController::class, 'index']);
  Route::get('check/{id}', [CommentController::class, 'check']);
  Route::post('comment', [CommentController::class, 'store']);
  Route::delete('comment/{id}',[CommentController::class, 'destroy']);
  // kinerja
  Route::get('kinerja', [KinerjaController::class, 'index']);
  Route::get('kinerja-pegawai/{id}', [KinerjaController::class, 'show']);
  Route::post('kinerja', [KinerjaController::class, 'store']);
  Route::put('kinerja/{id}', [KinerjaController::class, 'update']);
  Route::put('status-kinerja/{id}', [KinerjaController::class, 'updateStatus']);
  Route::delete('kinerja/{id}',[KinerjaController::class, 'destroy']);
  // kenaikan
  Route::get('kenaikan', [KenaikanController::class, 'index']);
  Route::post('kenaikan', [KenaikanController::class, 'store']);
  Route::get('profile/{id}', [PegawaiController::class, 'profile']);
});
