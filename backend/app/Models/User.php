<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\CanjeRecompensa;
use App\Models\RegistroReciclaje;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'email',
        'rol',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function registrosReciclaje(): HasMany
    {
        return $this->hasMany(RegistroReciclaje::class, 'usuario_id');
    }

    public function canjesRecompensa(): HasMany
    {
        return $this->hasMany(CanjeRecompensa::class, 'usuario_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
