<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JabatanController;
use App\Http\Controllers\PegawaiController;
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
  Route::post('pegawai', [PegawaiController::class, 'store']);
  Route::put('pegawai/{id}', [PegawaiController::class, 'update']);
});
