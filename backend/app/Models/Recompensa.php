<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recompensa extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'puntos_necesarios',
        'cantidad_disponible',
        'activa',
    ];

    protected $casts = [
        'puntos_necesarios' => 'integer',
        'cantidad_disponible' => 'integer',
        'activa' => 'boolean',
    ];

    public function canjes(): HasMany
    {
        return $this->hasMany(CanjeRecompensa::class, 'recompensa_id');
    }
}
