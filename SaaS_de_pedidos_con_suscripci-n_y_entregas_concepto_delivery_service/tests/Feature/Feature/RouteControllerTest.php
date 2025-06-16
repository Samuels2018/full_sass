<?php

namespace Tests\Feature\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\route\Route;
use Illuminate\Support\Str;

class RouteControllerTest extends TestCase {
  use RefreshDatabase;

  /** @test */
  public function it_creates_a_route_successfully() {
    $routeData = [
      'name' => 'Ruta Centro',
      'description' => 'Entrega a clientes premium',
      'date' => '2025-05-15',
      'start_time' => '08:30',
      'end_time' => '12:00',
      'vehicle_plate' => 'ABC-123',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(201)
      ->assertJson([
        'message' => 'Route created successfully',
        'data' => [
          'name' => 'Ruta Centro',
          'description' => 'Entrega a clientes premium',
          'vehicle_plate' => 'ABC-123',
        ]
      ]);

    $this->assertDatabaseHas('routes', [
      'name' => 'Ruta Centro',
      'vehicle_plate' => 'ABC-123',
    ]);
  }

  /** @test */
  public function it_creates_a_route_with_uuid_provided() {
    $uuid = Str::uuid()->toString();
    $routeData = [
      'uuid' => $uuid,
      'name' => 'Ruta Norte',
      'date' => '2025-05-16',
      'start_time' => '09:00',
      'end_time' => '13:00',
      'vehicle_plate' => 'XYZ-789',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(201);
    $this->assertEquals($uuid, $response['data']['uuid']);
  }

  /** @test */
  public function it_generates_uuid_if_not_provided() {
    $routeData = [
      'name' => 'Ruta Sur',
      'date' => '2025-05-17',
      'start_time' => '10:00',
      'end_time' => '14:00',
      'vehicle_plate' => 'DEF-456',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(201);
    $this->assertNotEmpty($response['data']['uuid']);
    $this->assertTrue(Str::isUuid($response['data']['uuid']));
  }

  /** @test */
  public function it_fails_when_required_fields_are_missing() {
    $routeData = [
      'description' => 'Ruta sin datos requeridos',
      'date' => '2025-05-18',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['name', 'start_time', 'end_time', 'vehicle_plate']);
  }

  /** @test */
  public function it_fails_when_date_is_invalid() {
    $routeData = [
      'name' => 'Ruta Este',
      'date' => 'invalid-date',
      'start_time' => '08:00',
      'end_time' => '12:00',
      'vehicle_plate' => 'GHI-789',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['date']);
  }

  /** @test */
  public function it_fails_when_time_format_is_invalid() {
    $routeData = [
      'name' => 'Ruta Oeste',
      'date' => '2025-05-19',
      'start_time' => '8:30 AM', // Formato incorrecto
      'end_time' => '5:00 PM',  // Formato incorrecto
      'vehicle_plate' => 'JKL-012',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['start_time', 'end_time']);
  }

  /** @test */
  public function it_fails_when_end_time_is_before_start_time() {
    $routeData = [
      'name' => 'Ruta Inversa',
      'date' => '2025-05-20',
      'start_time' => '14:00',
      'end_time' => '10:00', // Antes de start_time
      'vehicle_plate' => 'MNO-345',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['end_time']);
  }

  /** @test */
  public function it_accepts_optional_fields() {
    $routeData = [
      'name' => 'Ruta Completa',
      'date' => '2025-05-21',
      'start_time' => '07:00',
      'end_time' => '11:00',
      'vehicle_plate' => 'PQR-678',
      'driver_jwt' => 'eyJhbG...',
      'driver_info_cache' => ['nombre' => 'Juan Pérez']
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('routes', [
      'name' => 'Ruta Completa',
      'vehicle_plate' => 'PQR-678',
    ]);
  }

  /** @test */
  public function it_handles_server_errors_gracefully() {
    // Simular un error en la base de datos
    Route::shouldReceive('create')->andThrow(new \Exception('Database error'));

    $routeData = [
      'name' => 'Ruta Error',
      'date' => '2025-05-22',
      'start_time' => '06:00',
      'end_time' => '10:00',
      'vehicle_plate' => 'STU-901',
    ];

    $response = $this->postJson('/api/routes/create', $routeData);

    $response->assertStatus(500)
      ->assertJson([
        'message' => 'Error creating route',
        'error' => 'Database error'
      ]);
  }
}
