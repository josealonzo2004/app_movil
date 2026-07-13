<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroReciclaje extends Model
{
    protected $table = 'registros_reciclaje';

    protected $fillable = [
        'usuario_id',
        'material',
        'cantidad',
        'puntos',
        'ubicacion',
        'latitud',
        'longitud',
        'origen',
        'nota',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'puntos' => 'integer',
        'latitud' => 'decimal:7',
        'longitud' => 'decimal:7',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
