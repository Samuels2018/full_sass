<?php

namespace App\Http\Controllers\delivery;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\delivery\Delivery;
use App\Models\route\Route;
use App\Models\status\DeliveryStatus;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DeliveryController extends Controller {
  protected function ValidateDelivery(Request $request, $forCreate = true) {
    $rules = [
      'route_id' => [$forCreate ? 'required' : 'sometimes', 'integer'],
      'recipient_name' => [$forCreate ? 'required' : 'sometimes', 'string', 'max:255'],
      'recipient_phone' => [$forCreate ? 'required' : 'sometimes', 'string', 'max:20'],
      'recipient_address' => [$forCreate ? 'required' : 'sometimes', 'string'],
      'package_weight' => [$forCreate ? 'required' : 'sometimes', 'numeric', 'min:0.1'],
      'package_description' => [$forCreate ? 'required' : 'sometimes', 'string'],
      'scheduled_at' => ['required', 'date_format:Y-m-d H:i:s'],
      'delivery_instructions' => ['nullable', 'string'],
      'status_code' => ['nullable', 'string']
    ];

    $validator = Validator::make($request->all(), $rules);
    print_r("Validating delivery data");

    if ($validator->fails()) {
      throw new \Illuminate\Validation\ValidationException($validator);
    }

    return $validator->validated();
  }

  public function getAllDeliveries(Request $request) {
    try {

      $query = Delivery::with(['route', 'status'])
      ->orderBy('scheduled_at', 'desc');

      if ($request->has('status')) {
        $query->whereHas('status', function($q) use ($request) {
          $q->where('code', $request->input('status'));
        });
      }

      if ($request->has('route_id')) {
        $query->where('route_id', $request->input('route_id'));
      }

      $deliveries = $query->paginate(10);

      return response()->json([
        'success' => true,
        'data' => $deliveries
      ], 200);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error fetching deliveries',
        'error' => $e->getMessage()
      ], 500);
    }
  }


  public function registerDeliveries (Request $request) {

    try {
      // Validar los datos
      $validatedData = $this->ValidateDelivery($request);
      
      // Obtener el estado de entrega
      $status = DeliveryStatus::where('code', $validatedData['status_code'] ?? 'PROCESSING')->first();
      
      if (!$status) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid status code',
          'errors' => ['status_code' => 'Status not found']
        ], 400);
      }
      
      // Crear la entrega
      $delivery = Delivery::create(array_merge($validatedData, [
        'status_id' => $status->id
      ]));
      
      return response()->json([
        'success' => true,
        'message' => 'Delivery created successfully',
        'data' => $delivery
      ], 201);
      
    } catch (\Illuminate\Validation\ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation error',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Error creating delivery',
        'error' => $e->getMessage() // Asegúrate de pasar el mensaje como string
      ], 500);
    }



    
  }


  public function updateDeliveries (Request $request, $id) {
    $request->validate([
      
      'status_code' => [
        'required',
        Rule::exists('delivery_statuses', 'code')->where('is_active', true)
      ],
      'notes' => 'nullable|string'

    ]);

    $delivery = Delivery::findOrFail($id);
    $newStatus = DeliveryStatus::where('code', $request->status)->firstOrFail();

    switch ($newStatus->code) {
      case 'DELIVERED':
        $delivery->delivered_at = now();
        break;
      case 'FAILED':
        $delivery->failed_attempts = ($delivery->failed_attempts ?? 0) + 1;
        break;
      }

    $delivery->status_id = $newStatus->id;
    $delivery->save();

    return response()->json([
      'message' => 'Delivery status updated',
      'data' => $delivery->fresh(['status', 'route'])
    ], 200);
  }
}