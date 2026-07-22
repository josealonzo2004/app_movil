<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class RankingController extends Controller
{
    public function topUsers(): JsonResponse
    {
        $ranking = User::query()
            ->select('id', 'nombre')
            ->where('rol', 'usuario')
            ->withSum('registrosReciclaje as puntos_totales', 'puntos')
            ->orderByDesc('puntos_totales')
            ->limit(5)
            ->get()
            ->map(fn (User $usuario, int $index): array => [
                'posicion' => $index + 1,
                'usuario_id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'puntos' => (int) ($usuario->puntos_totales ?? 0),
            ]);

        return response()->json([
            'success' => true,
            'data' => $ranking,
        ]);
    }
}
