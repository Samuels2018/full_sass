<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('routes', function (Blueprint $table) {
      $table->id();
      $table->char('uuid', 36)->unique()->comment('UUID para uso frontend');
      $table->string('name');
      $table->text('driver_jwt')->nullable()->comment('JWT del conductor asociado');
      $table->json('driver_info_cache')->nullable()->comment('Cache de información decodificada del JWT');
      $table->text('description')->nullable();
      $table->date('date');
      $table->timestamp('start_time');
      $table->timestamp('end_time')->nullable();
      $table->string('vehicle_plate', 20)->nullable()->comment('Placa del vehículo');
      $table->timestamps();

      // Índices
      $table->index('date');
      $table->index(['start_time', 'end_time']);
      $table->index('vehicle_plate');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('routes');
  }
};
