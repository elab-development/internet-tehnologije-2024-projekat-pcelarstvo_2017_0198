<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed $roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Provera uloge na osnovu role_id
        if (!in_array($user->role_id, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden',
                'role_id' => $user->role_id
            ], 403);
        }

        return $next($request);
    }
}
