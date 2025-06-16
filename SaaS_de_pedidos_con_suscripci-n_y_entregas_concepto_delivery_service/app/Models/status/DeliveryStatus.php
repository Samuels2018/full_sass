<?php

namespace App\Models\status;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryStatus extends Model
{
  use HasFactory;
  protected $fillable = ['code', 'name', 'color', 'description', 'is_active'];
  
  /**
   * Estados predeterminados del sistema
   */
  public static function ensureStatusesExist()
  {
    $defaultStatuses = [
      [
        'code' => 'PENDING',
        'name' => 'Pendiente',
        'color' => '#FFA500',
        'description' => 'Entrega creada y pendiente de procesar',
        'is_active' => true
      ],
      [
        'code' => 'PROCESSING',
        'name' => 'En preparación',
        'color' => '#1E90FF',
        'description' => 'Preparando paquete para envío',
        'is_active' => true
      ],
      [
        'code' => 'ON_ROUTE',
        'name' => 'En camino',
        'color' => '#4169E1',
        'description' => 'Repartidor en ruta con el paquete',
        'is_active' => true
      ],
      [
        'code' => 'DELIVERED',
        'name' => 'Entregado',
        'color' => '#32CD32',
        'description' => 'Entrega completada con éxito',
        'is_active' => true
      ],
      [
        'code' => 'FAILED',
        'name' => 'Fallido',
        'color' => '#DC143C',
        'description' => 'Entrega no pudo ser completada',
        'is_active' => true
      ],
      [
        'code' => 'RETURNED',
        'name' => 'Devuelto',
        'color' => '#A9A9A9',
        'description' => 'Paquete devuelto al centro de distribución',
        'is_active' => true
      ]
    ];
    
    foreach ($defaultStatuses as $status) {
      self::firstOrCreate(
        ['code' => $status['code']],
        $status
      );
    }
  }
  
  /**
   * Relación con entregas
   */
  public function deliveries()
  {
    return $this->hasMany(Delivery::class);
  }
  
  /**
   * Scope para estados activos
   */
  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }
}