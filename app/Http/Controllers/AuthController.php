<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class AuthController extends Controller
{
  /**
   * __construct
   *
   * @return void
   */
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['login', 'register', 'refresh']]);
  }

  /**
   * login
   *
   * @param  mixed $request
   * @return void
   */
  public function login(Request $request)
  {
    $rules = [
      'username' => 'required|string',
      'password' => 'required'
    ];

    $validator = Validator::make($request->only(['username', 'password']), $rules, [
      'required' => 'The :attribute can not empty',
      'string' => 'The :attribute must be string'
    ]);

    if ($validator->fails()) {
      return response()->json(['error' => $validator->messages()->toArray()], 422);
    }

    $credentials = $request->only(['username', 'password']);
    if (!$token = auth()->setTTL(1)->attempt($credentials)) {
      return response()->json(['error' => 'Bad Credentials, please check again username and password'], 401);
    }

    $refreshToken = auth()->setTTL(1440)->attempt($credentials);
    return response()->json([
      'access_token' => $token,
      'refresh_token' => $refreshToken,
      'user' => $this->me()
    ], 200)->withCookie('rf_token', $refreshToken)->withCookie('auth_user', auth()->user()->id);
  }

  /**
   * me
   *
   * @return void
   */
  public function me()
  {
    return auth()->user()->load('pegawai', 'pegawai.jabatan');
  }

  /**
   * logout
   *
   * @return void
   */
  public function logout()
  {
    auth()->logout();

    return response()->json(['message' => 'Successfully logged out'])->withCookie(Cookie::forget('rf_token'))->withCookie(Cookie::forget('auth_user'));
  }

  /**
   * refresh
   *
   * @return void
   */
  public function refresh(Request $request)
  {
    $getCookie = $request->cookie('rf_token');
    $tokenParts = explode(".", $getCookie);
    $tokenHeader = base64_decode($tokenParts[0]);
    $tokenPayload = base64_decode($tokenParts[1]);
    $jwtHeader = json_decode($tokenHeader);
    $jwtPayload = json_decode($tokenPayload);
    // $humandate = date("Y-m-d H:i:s", $jwtPayload->exp);
    $now = Date::now()->format('U');
    // return response()->json([
    //   'exp' => $jwtPayload->exp,
    //   'now' => (int)$now,
    //   'user' => $request->cookie('auth_user')
    // ]);
    if ($jwtPayload->exp < $now) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }
    return response()->json([
      'access_token' => auth()->setTTL(1)->tokenById($request->cookie('auth_user')),
    ], 200);
  }

  public function register(Request $request)
  {
    $data = [
      'id' => Uuid::generate()->string,
      'username' => $request->username,
      'password' => Hash::make($request->password),
      'pegawai_id' => $request->pegawai_id,
      'created_at' => round(microtime(true) * 1000),
    ];
    User::create($data);
    return response()->json('created', 201);
  }

  public function hello()
  {
    return response()->json('Hello World');
  }
}
