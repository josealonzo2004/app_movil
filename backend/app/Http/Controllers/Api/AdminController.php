<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CanjeRecompensa;
use App\Models\CentroReciclaje;
use App\Models\Recompensa;
use App\Models\RegistroReciclaje;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function resumen(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'usuarios' => User::count(),
                'centros' => CentroReciclaje::count(),
                'recompensas' => Recompensa::count(),
                'canjes_pendientes' => CanjeRecompensa::where('estado', 'pendiente')->count(),
                'puntos_generados' => RegistroReciclaje::sum('puntos'),
            ],
        ]);
    }

    public function usuarios(): JsonResponse
    {
        $usuarios = User::query()
            ->select('id', 'nombre', 'email', 'rol', 'created_at')
            ->withSum('registrosReciclaje as puntos_totales', 'puntos')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $usuarios,
        ]);
    }

    public function actualizarUsuario(Request $request, User $usuario): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,'.$usuario->id],
            'rol' => ['sometimes', 'required', 'in:admin,usuario'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if (isset($datos['password'])) {
            $datos['password'] = Hash::make($datos['password']);
        } else {
            unset($datos['password']);
        }

        $usuario->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'data' => $usuario,
        ]);
    }

    public function eliminarUsuario(Request $request, User $usuario): JsonResponse
    {
        if ($request->user()->id === $usuario->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar tu propio usuario administrador.',
            ], 422);
        }

        $usuario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente.',
        ]);
    }

    public function centros(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => CentroReciclaje::latest()->get(),
        ]);
    }

    public function guardarCentro(Request $request): JsonResponse
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
            'activo' => $datos['activo'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Centro guardado correctamente.',
            'data' => $centro,
        ], 201);
    }

    public function actualizarCentro(Request $request, CentroReciclaje $centro): JsonResponse
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

        $centro->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Centro actualizado correctamente.',
            'data' => $centro,
        ]);
    }

    public function eliminarCentro(CentroReciclaje $centro): JsonResponse
    {
        $centro->delete();

        return response()->json([
            'success' => true,
            'message' => 'Centro eliminado correctamente.',
        ]);
    }

    public function recompensas(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Recompensa::latest()->get(),
        ]);
    }

    public function guardarRecompensa(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'puntos_necesarios' => ['required', 'integer', 'min:1'],
            'cantidad_disponible' => ['required', 'integer', 'min:0'],
            'activa' => ['nullable', 'boolean'],
        ]);

        $recompensa = Recompensa::create([
            ...$datos,
            'activa' => $datos['activa'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Recompensa guardada correctamente.',
            'data' => $recompensa,
        ], 201);
    }

    public function actualizarRecompensa(Request $request, Recompensa $recompensa): JsonResponse
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

    public function eliminarRecompensa(Recompensa $recompensa): JsonResponse
    {
        $recompensa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Recompensa eliminada correctamente.',
        ]);
    }

    public function canjes(): JsonResponse
    {
        $canjes = CanjeRecompensa::query()
            ->with([
                'usuario:id,nombre,email',
                'recompensa:id,nombre,puntos_necesarios',
            ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $canjes,
        ]);
    }

    public function actualizarCanje(Request $request, CanjeRecompensa $canje): JsonResponse
    {
        $datos = $request->validate([
            'estado' => ['required', 'in:pendiente,aprobado,entregado,cancelado'],
        ]);

        $estadoAnterior = $canje->estado;
        $canje->update($datos);

        if ($datos['estado'] === 'cancelado' && $estadoAnterior !== 'cancelado') {
            $canje->recompensa()->increment('cantidad_disponible');
        }

        return response()->json([
            'success' => true,
            'message' => 'Canje actualizado correctamente.',
            'data' => $canje->load([
                'usuario:id,nombre,email',
                'recompensa:id,nombre,puntos_necesarios',
            ]),
        ]);
    }
}
