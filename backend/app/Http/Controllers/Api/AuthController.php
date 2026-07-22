<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $usuario = User::create([
            'nombre' => $datos['nombre'],
            'email' => $datos['email'],
            'password' => Hash::make($datos['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente.',
            'data' => [
                'usuario' => $usuario,
                'token' => $usuario->createToken('app-movil')->plainTextToken,
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credenciales = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credenciales)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        $usuario = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesion correcto.',
            'data' => [
                'usuario' => $usuario,
                'token' => $usuario->createToken('app-movil')->plainTextToken,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $usuario = $request->user();
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$usuario->id],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if (! empty($datos['password'])) {
            $datos['password'] = Hash::make($datos['password']);
        } else {
            unset($datos['password']);
        }

        $usuario->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente.',
            'data' => $usuario->fresh(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesion cerrada correctamente.',
        ]);
    }
}
