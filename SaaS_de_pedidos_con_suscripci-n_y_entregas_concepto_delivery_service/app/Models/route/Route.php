<?php

namespace App\Models\route;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\delivery\Delivery;

class Route extends Model
{
  use HasFactory;

  protected $fillable = [
    'uuid',
    'name',
    'driver_jwt',
    'driver_info_cache',
    'description',
    'date',
    'start_time',
    'end_time',
    'vehicle_plate'
  ];

  protected $casts = [
    'date' => 'date',
    'start_time' => 'datetime',
    'end_time' => 'datetime',
    'driver_info_cache' => 'array'
  ];

  public function getDriverAttribute()
  {
    if (!$this->driver_jwt) {
      return null;
    }

    // Si tenemos cache y no está expirado
    if ($this->driver_info_cache && !$this->isDriverInfoExpired()) {
      return (object) $this->driver_info_cache;
    }

    // Decodificar el JWT (sin verificar firma)
    $payload = json_decode(base64_decode(
      explode('.', $this->driver_jwt)[1]
    ), true);

    // Actualizar cache
    $this->update(['driver_info_cache' => $payload]);
    
    return (object) $payload;
  }

  private function isDriverInfoExpired()
  {
    if (!$this->driver_info_cache) {
      return true;
    }

    $exp = $this->driver_info_cache['exp'] ?? null;
    return $exp && $exp < time();
  }
  public function deliveries() {
    return $this->hasMany(Delivery::class);
  }


}
