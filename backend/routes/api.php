<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CanjeRecompensaController;
use App\Http\Controllers\Api\CentroReciclajeController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\RecompensaController;
use App\Http\Controllers\Api\RegistroReciclajeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'success' => true,
    'message' => 'API EcoSmart funcionando.',
]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/ranking/top-usuarios', [RankingController::class, 'topUsers']);

    Route::apiResource('registros-reciclaje', RegistroReciclajeController::class)
        ->parameters(['registros-reciclaje' => 'registroReciclaje']);
    Route::apiResource('centros-reciclaje', CentroReciclajeController::class)
        ->parameters(['centros-reciclaje' => 'centroReciclaje']);
    Route::apiResource('recompensas', RecompensaController::class);
    Route::apiResource('canjes-recompensa', CanjeRecompensaController::class)
        ->parameters(['canjes-recompensa' => 'canjeRecompensa']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
