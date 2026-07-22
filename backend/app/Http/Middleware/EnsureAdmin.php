<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->rol !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos de administrador.',
            ], 403);
        }

        return $next($request);
    }
}
