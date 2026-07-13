<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recompensa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecompensaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Recompensa::latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'puntos_necesarios' => ['required', 'integer', 'min:1'],
            'cantidad_disponible' => ['required', 'integer', 'min:0'],
            'activa' => ['nullable', 'boolean'],
        ]);

        $recompensa = Recompensa::create($datos);

        return response()->json([
            'success' => true,
            'message' => 'Recompensa guardada correctamente.',
            'data' => $recompensa,
        ], 201);
    }

    public function show(Recompensa $recompensa): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $recompensa,
        ]);
    }

    public function update(Request $request, Recompensa $recompensa): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:120'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'puntos_necesarios' => ['sometimes', 'required', 'integer', 'min:1'],
            'cantidad_disponible' => ['sometimes', 'required', 'integer', 'min:0'],
            'activa' => ['nullable', 'boolean'],
        ]);

        $recompensa->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Recompensa actualizada correctamente.',
            'data' => $recompensa,
        ]);
    }

    public function destroy(Recompensa $recompensa): JsonResponse
    {
        $recompensa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Recompensa eliminada correctamente.',
        ]);
    }
}
