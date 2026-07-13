<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CentroReciclaje extends Model
{
    protected $table = 'centros_reciclaje';

    protected $fillable = [
        'usuario_id',
        'nombre',
        'direccion',
        'latitud',
        'longitud',
        'materiales_aceptados',
        'horario',
        'activo',
    ];

    protected $casts = [
        'latitud' => 'decimal:7',
        'longitud' => 'decimal:7',
        'materiales_aceptados' => 'array',
        'activo' => 'boolean',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
