<?php

namespace App\Http\Middleware\verify;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// env('DB_CONNECTION', 'sqlite')

class VerifyExternalJwt {
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response {
    $token = $request->bearerToken();
    
    try {
      $decoded = JWT::decode($token, new Key(env('JWT_SECRET', null), env('JWT_ALGORITHM', null)));
      $request->merge([
        'auth_user' => (array)$decoded
      ]);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    return $next($request);
  }
}