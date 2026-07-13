<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanjeRecompensa extends Model
{
    protected $table = 'canjes_recompensa';

    protected $fillable = [
        'usuario_id',
        'recompensa_id',
        'puntos_usados',
        'estado',
        'fecha_canje',
    ];

    protected $casts = [
        'puntos_usados' => 'integer',
        'fecha_canje' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function recompensa(): BelongsTo
    {
        return $this->belongsTo(Recompensa::class, 'recompensa_id');
    }
}
