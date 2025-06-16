<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('delivery_statuses', function (Blueprint $table) {
      $table->id();
      $table->string('code', 50)->unique();
      $table->string('name', 100);
      $table->string('color', 7); // Almacena código hexadecimal
      $table->text('description')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->index('code');
    });

    // Insertar estados predeterminados
    DB::table('delivery_statuses')->insert([
      [
        'code' => 'PENDING',
        'name' => 'Pendiente',
        'color' => '#FFA500',
        'description' => 'Entrega creada y pendiente de procesar',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ],
      [
        'code' => 'PROCESSING',
        'name' => 'En preparación',
        'color' => '#1E90FF',
        'description' => 'Preparando paquete para envío',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ],
      [
        'code' => 'ON_ROUTE',
        'name' => 'En camino',
        'color' => '#4169E1',
        'description' => 'Repartidor en ruta con el paquete',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ],
      [
        'code' => 'DELIVERED',
        'name' => 'Entregado',
        'color' => '#32CD32',
        'description' => 'Entrega completada con éxito',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ],
      [
        'code' => 'FAILED',
        'name' => 'Fallido',
        'color' => '#DC143C',
        'description' => 'Entrega no pudo ser completada',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ],
      [
        'code' => 'RETURNED',
        'name' => 'Devuelto',
        'color' => '#A9A9A9',
        'description' => 'Paquete devuelto al centro de distribución',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now()
      ]
    ]);

  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('delivery_statuses');
  }
};
