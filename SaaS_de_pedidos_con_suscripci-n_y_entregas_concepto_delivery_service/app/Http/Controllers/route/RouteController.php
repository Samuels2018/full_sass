<?php

namespace App\Http\Controllers\route;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\route\Route;
use Illuminate\Support\Facades\Validator;

class RouteController extends Controller {
  protected function validateRoute(Request $request) {
    return $request->validate([
      'name' => 'required|string|max:255',
      'description' => 'nullable|string',
      'date' => 'required|date',
      'start_time' => 'required|date_format:H:i',
      'end_time' => 'required|date_format:H:i|after:start_time',
      'vehicle_plate' => 'required|string|max:10'
    ]);
  }

  public function createRoute(Request $request) {
    try {
      $validated = $this->validateRoute($request);
      print_r("Validating route data");

      if (!isset($validated['uuid'])) {
        $validated['uuid'] = \Illuminate\Support\Str::uuid()->toString();
      }

      
      $route = Route::create($validated);
      
      return response()->json([
        'message' => 'Route created successfully',
        'data' => $route
      ], 201);

    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error creating route',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}

