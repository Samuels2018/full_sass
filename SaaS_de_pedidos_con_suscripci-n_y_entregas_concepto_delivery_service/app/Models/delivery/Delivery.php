<?php

namespace App\Models\delivery;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\route\Route;
use App\Models\status\DeliveryStatus;

class Delivery extends Model
{
  use HasFactory;


  protected $fillable = [
    'route_id',
    'status_id',
    'tracking_number',
    'recipient_name',
    'recipient_phone',
    'recipient_address',
    'delivery_instructions',
    'package_weight',
    'package_description',
    'scheduled_at',
    'delivered_at',
    'delivery_proof'
  ];


  protected $casts = [
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
    'scheduled_at' => 'datetime',
    'delivered_at' => 'datetime',
  ];


  protected static function boot() {
    parent::boot();
    
    static::creating(function ($model) {
      // Garantizar existencia de estados
      DeliveryStatus::ensureStatusesExist();
      
      // Generar número de tracking si no existe
      if (empty($model->tracking_number)) {
        $model->tracking_number = static::generateTrackingNumber();
      }
      
      // Asignar estado inicial si no se especifica
      if (empty($model->status_id)) {
        $model->status_id = DeliveryStatus::where('code', 'PENDING')->first()->id;
      }
    });
  }
    
    /**
     * Genera un número de tracking único
     */
  public static function generateTrackingNumber() {
    return 'DEL-' . strtoupper(uniqid());
  }
    

  public function route() {
    return $this->belongsTo(Route::class, 'route_id', 'id');
  }

  public function status () {
    return $this->belongsTo(DeliveryStatus::class);
  }
}