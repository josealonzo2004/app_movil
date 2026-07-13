<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CanjeRecompensa;
use App\Models\Recompensa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CanjeRecompensaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $canjes = $request->user()
            ->canjesRecompensa()
            ->with('recompensa')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $canjes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'recompensa_id' => ['required', 'exists:recompensas,id'],
        ]);

        $usuario = $request->user();
        $recompensa = Recompensa::findOrFail($datos['recompensa_id']);
        $puntosGanados = $usuario->registrosReciclaje()->sum('puntos');
        $puntosUsados = $usuario->canjesRecompensa()
            ->whereIn('estado', ['pendiente', 'aprobado'])
            ->sum('puntos_usados');
        $puntosDisponibles = $puntosGanados - $puntosUsados;

        if (! $recompensa->activa || $recompensa->cantidad_disponible < 1) {
            return response()->json([
                'success' => false,
                'message' => 'La recompensa no esta disponible.',
            ], 422);
        }

        if ($puntosDisponibles < $recompensa->puntos_necesarios) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes puntos suficientes para este canje.',
                'data' => ['puntos_disponibles' => $puntosDisponibles],
            ], 422);
        }

        $canje = CanjeRecompensa::create([
            'usuario_id' => $usuario->id,
            'recompensa_id' => $recompensa->id,
            'puntos_usados' => $recompensa->puntos_necesarios,
            'estado' => 'pendiente',
            'fecha_canje' => now(),
        ]);

        $recompensa->decrement('cantidad_disponible');

        return response()->json([
            'success' => true,
            'message' => 'Canje de recompensa registrado correctamente.',
            'data' => $canje->load('recompensa'),
        ], 201);
    }

    public function show(Request $request, CanjeRecompensa $canjeRecompensa): JsonResponse
    {
        abort_if($canjeRecompensa->usuario_id !== $request->user()->id, 403);

        return response()->json([
            'success' => true,
            'data' => $canjeRecompensa->load('recompensa'),
        ]);
    }

    public function update(Request $request, CanjeRecompensa $canjeRecompensa): JsonResponse
    {
        $datos = $request->validate([
            'estado' => ['required', 'in:pendiente,aprobado,entregado,cancelado'],
        ]);

        $canjeRecompensa->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Canje actualizado correctamente.',
            'data' => $canjeRecompensa->load('recompensa'),
        ]);
    }

    public function destroy(Request $request, CanjeRecompensa $canjeRecompensa): JsonResponse
    {
        abort_if($canjeRecompensa->usuario_id !== $request->user()->id, 403);

        $canjeRecompensa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Canje eliminado correctamente.',
        ]);
    }
}
