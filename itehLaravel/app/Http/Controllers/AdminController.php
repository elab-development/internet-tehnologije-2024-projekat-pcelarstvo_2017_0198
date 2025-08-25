<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Kosnica;
use App\Models\Aktivnost;
use App\Models\Komentar;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Ukupan broj korisnika po ulogama
    public function usersStats()
    {
        $stats = User::select('role_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('role_id')
            ->with('role') 
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    // Statistika o košnicama (ukupan broj, po korisnicima)
    public function kosniceStats()
    {
        $stats = Kosnica::select('user_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('user_id')
            ->get();

        $total = Kosnica::count();

        return response()->json([
            'success' => true,
            'total' => $total,
            'data' => $stats,
        ]);
    }

    // Statistika o aktivnostima (ukupan broj, po tipu)
    public function aktivnostiStats()
    {
        $stats = Aktivnost::select('tip')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('tip')
            ->get();

        $total = Aktivnost::count();

        return response()->json([
            'success' => true,
            'total' => $total,
            'data' => $stats,
        ]);
    }

    // Statistika komentara (ukupan broj, po košnicama)
    public function komentariStats()
    {
        $stats = Komentar::select('kosnica_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('kosnica_id')
            ->get();

        $total = Komentar::count();

        return response()->json([
            'success' => true,
            'total' => $total,
            'data' => $stats,
        ]);
    }

    // Statistika aktivnosti u određenom opsegu datuma
    public function aktivnostiByDateRange(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $stats = Aktivnost::whereBetween('datum', [$request->start_date, $request->end_date])
            ->select('tip')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('tip')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
