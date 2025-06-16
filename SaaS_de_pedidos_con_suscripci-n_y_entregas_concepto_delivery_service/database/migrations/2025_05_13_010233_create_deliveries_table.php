<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('deliveries', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('route_id');
      $table->unsignedBigInteger('status_id');
      $table->string('tracking_number')->unique();
      $table->string('recipient_name');
      $table->string('recipient_phone', 20);
      $table->text('recipient_address');
      $table->text('delivery_instructions')->nullable();
      $table->decimal('package_weight', 8, 2); // Hasta 999999.99 kg
      $table->text('package_description');
      $table->timestamp('scheduled_at');
      $table->timestamp('delivered_at')->nullable();
      $table->string('delivery_proof')->nullable(); // Path/URL del comprobante
      $table->timestamps();
      
      $table->foreign('route_id')
        ->references('id')  // IMPORTANTE: La tabla routes debe tener id como string/UUID
        ->on('routes')
        ->onDelete('cascade');

      // Índices y claves foráneas
      $table->foreign('status_id')
        ->references('id')
        ->on('delivery_statuses')
        ->onDelete('cascade');

      $table->index(['route_id', 'status_id']);
      $table->index('scheduled_at');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('deliveries');
  }
};
