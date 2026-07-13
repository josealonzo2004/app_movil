<?php

namespace Database\Seeders;

use App\Models\CentroReciclaje;
use App\Models\Recompensa;
use App\Models\RegistroReciclaje;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $usuario = User::create([
            'nombre' => 'Usuario EcoSmart',
            'email' => 'demo@ecosmart.test',
            'password' => Hash::make('password123'),
        ]);

        RegistroReciclaje::create([
            'usuario_id' => $usuario->id,
            'material' => 'Plastico',
            'cantidad' => 2,
            'puntos' => 24,
            'ubicacion' => 'Quito',
            'origen' => 'scanner_simulado',
        ]);

        RegistroReciclaje::create([
            'usuario_id' => $usuario->id,
            'material' => 'Papel',
            'cantidad' => 1,
            'puntos' => 8,
            'ubicacion' => 'Quito',
            'origen' => 'scanner_simulado',
        ]);

        CentroReciclaje::create([
            'usuario_id' => $usuario->id,
            'nombre' => 'Punto Verde Norte',
            'direccion' => 'Av. Amazonas y Naciones Unidas',
            'latitud' => -0.1763000,
            'longitud' => -78.4846000,
            'materiales_aceptados' => ['Plastico', 'Papel', 'Vidrio'],
            'horario' => 'Lunes a viernes 08:00 - 17:00',
            'activo' => true,
        ]);

        Recompensa::create([
            'nombre' => 'Descuento en tienda aliada',
            'descripcion' => 'Cupon de descuento por reciclar de forma constante.',
            'puntos_necesarios' => 100,
            'cantidad_disponible' => 10,
            'activa' => true,
        ]);
    }
}
