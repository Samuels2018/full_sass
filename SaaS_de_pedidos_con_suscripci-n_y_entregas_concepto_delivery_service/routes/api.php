<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\delivery\DeliveryController;
use App\Http\Controllers\route\RouteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth.external')->group(function () {
  Route::prefix('delivery')->group(function () {
    Route::get('/', [DeliveryController::class, 'getAllDeliveries']);
    Route::post('/create', [DeliveryController::class, 'registerDeliveries']);
    Route::patch('/{id}/status', [DeliveryController::class, 'updateDeliveries']);
  });

  Route::prefix('routes')->group(function () {
    Route::post('/create', [RouteController::class, 'createRoute']);
  });

});