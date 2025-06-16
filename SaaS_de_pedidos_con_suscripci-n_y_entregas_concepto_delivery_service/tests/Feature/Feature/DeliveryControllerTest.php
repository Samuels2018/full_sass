<?php

namespace Tests\Feature\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\delivery\Delivery;
use App\Models\route\Route;
use App\Models\status\DeliveryStatus;

class DeliveryControllerTest extends TestCase {
  use RefreshDatabase;

  protected function setUp(): void {
    parent::setUp();
    
    // Crear estados de entrega básicos
    DeliveryStatus::create(['code' => 'PROCESSING', 'name' => 'En proceso', 'is_active' => true]);
    DeliveryStatus::create(['code' => 'DELIVERED', 'name' => 'Entregado', 'is_active' => true]);
    DeliveryStatus::create(['code' => 'FAILED', 'name' => 'Fallido', 'is_active' => true]);
    
    // Crear una ruta de prueba
    $this->route = Route::create([
      'name' => 'Ruta Test',
      'date' => '2023-12-15',
      'start_time' => '08:00',
      'end_time' => '17:00',
      'vehicle_plate' => 'TEST123'
    ]);
  }

  /** @test */
  public function it_registers_a_new_delivery_successfully() {
    $deliveryData = [
      'route_id' => $this->route->id,
      'recipient_name' => 'María González',
      'recipient_phone' => '5551234567',
      'recipient_address' => 'Av. Principal 123, Col. Centro',
      'package_weight' => 2.5,
      'package_description' => 'Paquete con documentos legales',
      'scheduled_at' => '2023-12-15 14:00:00',
      'delivery_instructions' => 'Entregar en recepción, preguntar por Sra. Pérez',
      'status_code' => 'PROCESSING'
    ];

    $response = $this->postJson('/api/delivery/create', $deliveryData);

    $response->assertStatus(201)
      ->assertJson([
        'success' => true,
        'message' => 'Delivery created successfully',
        'data' => [
          'recipient_name' => 'María González',
          'package_weight' => 2.5,
          'status' => [
            'code' => 'PROCESSING'
          ]
        ]
      ]);

    $this->assertDatabaseHas('deliveries', [
      'recipient_name' => 'María González',
      'route_id' => $this->route->id
    ]);
  }

  /** @test */
  public function it_fails_when_required_fields_are_missing() {
    $invalidData = [
      'route_id' => $this->route->id,
      // Faltan los demás campos requeridos
    ];

    $response = $this->postJson('/api/delivery/create', $invalidData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors([
        'recipient_name', 
        'recipient_phone', 
        'recipient_address',
        'package_weight',
        'package_description',
        'scheduled_at'
      ]);
  }

  /** @test */
  public function it_fails_with_invalid_status_code() {
    $deliveryData = [
      'route_id' => $this->route->id,
      'recipient_name' => 'Juan Pérez',
      'recipient_phone' => '5557654321',
      'recipient_address' => 'Calle Secundaria 456',
      'package_weight' => 1.2,
      'package_description' => 'Paquete pequeño',
      'scheduled_at' => '2023-12-15 10:00:00',
      'status_code' => 'INVALID_STATUS' // Código inválido
    ];

    $response = $this->postJson('/api/delivery/create', $deliveryData);

    $response->assertStatus(400)
      ->assertJson([
        'success' => false,
        'message' => 'Invalid status code',
        'errors' => ['status_code' => 'Status not found']
      ]);
  }

  /** @test */
  public function it_uses_default_status_when_not_provided() {
    $deliveryData = [
      'route_id' => $this->route->id,
      'recipient_name' => 'Carlos Sánchez',
      'recipient_phone' => '5559876543',
      'recipient_address' => 'Boulevard Norte 789',
      'package_weight' => 3.0,
      'package_description' => 'Paquete mediano',
      'scheduled_at' => '2023-12-15 11:00:00'
      // No se proporciona status_code
    ];

    $response = $this->postJson('/api/delivery/create', $deliveryData);

    $response->assertStatus(201);
    $this->assertEquals('PROCESSING', $response['data']['status']['code']);
  }

  /** @test */
  public function it_gets_all_deliveries() {
    // Crear entregas de prueba
    Delivery::factory()->count(5)->create(['route_id' => $this->route->id]);

    $response = $this->getJson('/api/delivery');

    $response->assertStatus(200)
      ->assertJson([
          'success' => true,
      ])
      ->assertJsonCount(5, 'data.data'); // Asumiendo paginación con 5 elementos
  }

  /** @test */
  public function it_filters_deliveries_by_status() {
    // Crear entregas con diferentes estados
    Delivery::factory()->create(['route_id' => $this->route->id, 'status_id' => DeliveryStatus::where('code', 'PROCESSING')->first()->id]);
    Delivery::factory()->create(['route_id' => $this->route->id, 'status_id' => DeliveryStatus::where('code', 'DELIVERED')->first()->id]);

    $response = $this->getJson('/api/delivery?status=DELIVERED');

    $response->assertStatus(200)
      ->assertJsonCount(1, 'data.data') // Solo debería haber una entrega con estado DELIVERED
      ->assertJsonPath('data.data.0.status.code', 'DELIVERED');
  }

  /** @test */
  public function it_filters_deliveries_by_route_id() {
    $secondRoute = Route::create([
      'name' => 'Ruta Alterna',
      'date' => '2023-12-16',
      'start_time' => '09:00',
      'end_time' => '18:00',
      'vehicle_plate' => 'ALT456'
    ]);

    Delivery::factory()->create(['route_id' => $this->route->id]);
    Delivery::factory()->create(['route_id' => $secondRoute->id]);

    $response = $this->getJson('/api/delivery?route_id=' . $this->route->id);

    $response->assertStatus(200)
      ->assertJsonCount(1, 'data.data') // Solo debería haber una entrega para esta ruta
      ->assertJsonPath('data.data.0.route_id', $this->route->id);
  }

  /** @test */
  public function it_updates_delivery_status_successfully() {
    $delivery = Delivery::factory()->create([
      'route_id' => $this->route->id,
      'status_id' => DeliveryStatus::where('code', 'PROCESSING')->first()->id
    ]);

    $updateData = [
      'status_code' => 'DELIVERED',
      'notes' => 'Entregado en recepción'
    ];

    $response = $this->putJson("/api/delivery/{$delivery->id}", $updateData);

    $response->assertStatus(200)
      ->assertJson([
        'message' => 'Delivery status updated',
        'data' => [
          'status' => [
            'code' => 'DELIVERED'
          ],
          'delivered_at' => now()->toDateTimeString()
        ]
      ]);

    $this->assertNotNull($response['data']['delivered_at']);
  }

  /** @test */
  public function it_increments_failed_attempts_when_status_is_failed() {
    $delivery = Delivery::factory()->create([
      'route_id' => $this->route->id,
      'status_id' => DeliveryStatus::where('code', 'PROCESSING')->first()->id,
      'failed_attempts' => 0
    ]);

    $updateData = [
      'status_code' => 'FAILED',
      'notes' => 'No había nadie en la dirección'
    ];

    $response = $this->putJson("/api/delivery/{$delivery->id}", $updateData);

    $response->assertStatus(200);
    $this->assertEquals(1, $response['data']['failed_attempts']);
  }

  /** @test */
  public function it_fails_to_update_with_invalid_status() {
    $delivery = Delivery::factory()->create(['route_id' => $this->route->id]);

    $updateData = [
      'status_code' => 'INVALID_STATUS',
      'notes' => 'Estado inválido'
    ];

    $response = $this->putJson("/api/delivery/{$delivery->id}", $updateData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['status_code']);
  }

  /** @test */
  public function it_returns_404_when_updating_nonexistent_delivery() {
    $nonExistentId = 9999;
    $updateData = [
      'status_code' => 'DELIVERED',
      'notes' => 'No debería existir'
    ];

    $response = $this->putJson("/api/delivery/{$nonExistentId}", $updateData);

    $response->assertStatus(404);
  }

  /** @test */
  public function it_handles_server_errors_gracefully() {
    // Simular un error en el servidor
    $mock = $this->mock(Delivery::class);
    $mock->shouldReceive('findOrFail')->andThrow(new \Exception('Database error'));

    $response = $this->putJson("/api/delivery/1", [
      'status_code' => 'DELIVERED'
    ]);

    $response->assertStatus(500)
      ->assertJson([
        'message' => 'Error updating delivery'
      ]);
  }
}
