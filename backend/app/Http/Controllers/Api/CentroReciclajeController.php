<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CentroReciclaje;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CentroReciclajeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => CentroReciclaje::latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'direccion' => ['required', 'string', 'max:255'],
            'latitud' => ['nullable', 'numeric', 'between:-90,90'],
            'longitud' => ['nullable', 'numeric', 'between:-180,180'],
            'materiales_aceptados' => ['nullable', 'array'],
            'materiales_aceptados.*' => ['string', 'max:80'],
            'horario' => ['nullable', 'string', 'max:120'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $centro = CentroReciclaje::create([
            ...$datos,
            'usuario_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Centro de reciclaje guardado correctamente.',
            'data' => $centro,
        ], 201);
    }

    public function show(CentroReciclaje $centroReciclaje): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $centroReciclaje,
        ]);
    }

    public function update(Request $request, CentroReciclaje $centroReciclaje): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:120'],
            'direccion' => ['sometimes', 'required', 'string', 'max:255'],
            'latitud' => ['nullable', 'numeric', 'between:-90,90'],
            'longitud' => ['nullable', 'numeric', 'between:-180,180'],
            'materiales_aceptados' => ['nullable', 'array'],
            'materiales_aceptados.*' => ['string', 'max:80'],
            'horario' => ['nullable', 'string', 'max:120'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $centroReciclaje->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Centro de reciclaje actualizado correctamente.',
            'data' => $centroReciclaje,
        ]);
    }

    public function destroy(CentroReciclaje $centroReciclaje): JsonResponse
    {
        $centroReciclaje->delete();

        return response()->json([
            'success' => true,
            'message' => 'Centro de reciclaje eliminado correctamente.',
        ]);
    }
}
