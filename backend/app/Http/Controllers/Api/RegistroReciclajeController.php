<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistroReciclaje;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistroReciclajeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $registros = $request->user()
            ->registrosReciclaje()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $registros,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'material' => ['required', 'string', 'max:80'],
            'cantidad' => ['required', 'integer', 'min:1'],
            'puntos' => ['required', 'integer', 'min:0'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'latitud' => ['nullable', 'numeric', 'between:-90,90'],
            'longitud' => ['nullable', 'numeric', 'between:-180,180'],
            'origen' => ['nullable', 'string', 'max:60'],
            'nota' => ['nullable', 'string', 'max:500'],
        ]);

        $registro = $request->user()->registrosReciclaje()->create([
            ...$datos,
            'origen' => $datos['origen'] ?? 'scanner_simulado',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registro de reciclaje guardado correctamente.',
            'data' => $registro,
        ], 201);
    }

    public function show(Request $request, RegistroReciclaje $registroReciclaje): JsonResponse
    {
        abort_if($registroReciclaje->usuario_id !== $request->user()->id, 403);

        return response()->json([
            'success' => true,
            'data' => $registroReciclaje,
        ]);
    }

    public function update(Request $request, RegistroReciclaje $registroReciclaje): JsonResponse
    {
        abort_if($registroReciclaje->usuario_id !== $request->user()->id, 403);

        $datos = $request->validate([
            'material' => ['sometimes', 'required', 'string', 'max:80'],
            'cantidad' => ['sometimes', 'required', 'integer', 'min:1'],
            'puntos' => ['sometimes', 'required', 'integer', 'min:0'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'latitud' => ['nullable', 'numeric', 'between:-90,90'],
            'longitud' => ['nullable', 'numeric', 'between:-180,180'],
            'origen' => ['nullable', 'string', 'max:60'],
            'nota' => ['nullable', 'string', 'max:500'],
        ]);

        $registroReciclaje->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Registro de reciclaje actualizado correctamente.',
            'data' => $registroReciclaje,
        ]);
    }

    public function destroy(Request $request, RegistroReciclaje $registroReciclaje): JsonResponse
    {
        abort_if($registroReciclaje->usuario_id !== $request->user()->id, 403);

        $registroReciclaje->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro de reciclaje eliminado correctamente.',
        ]);
    }
}
