<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Kosnica;
use App\Models\Aktivnost;
use App\Models\Komentar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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



     /**
     * Izvoz podataka o odabranim košnicama (za frontend PDF).
     *
     * Query parametri:
     * - kosnica_ids[] (required): niz ID-jeva košnica
     * - date_from, date_to (optional): filtriranje aktivnosti/komentara po datumu
     * - include (optional): CSV lista dodataka: aktivnosti,komentari,vlasnik,autori
     *   - aktivnosti  -> uključuje liste aktivnosti (sa autorom)
     *   - komentari   -> uključuje liste komentara (sa autorom)
     *   - vlasnik     -> uključuje vlasnika košnice (user)
     *   - autori      -> dodaje .user na aktivnosti/komentare (pčelari koji su kreirali zapise)
     *
     * Primer poziva:
     * /api/admin/reports/kosnice?kosnica_ids[]=1&kosnica_ids[]=3&date_from=2025-01-01&date_to=2025-12-31&include=aktivnosti,komentari,vlasnik,autori
     */
    public function exportKosniceReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kosnica_ids'   => 'required|array|min:1',
            'kosnica_ids.*' => 'integer|exists:kosnicas,id',
           
            'include'       => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $ids       = $request->input('kosnica_ids', []);
       
        $include   = collect(explode(',', (string)$request->input('include', 'aktivnosti,komentari,vlasnik,autori')))
                        ->map(fn($s) => trim($s))
                        ->filter()
                        ->values();

        // Osnovni upit
        $query = Kosnica::query()->whereIn('id', $ids);

       

        // Dinamičko eager-loadovanje relacija
        $with = [];

        // vlasnik košnice
        if ($include->contains('vlasnik')) {
            $with[] = 'user';
        }

        // aktivnosti (+ opcioni autor aktivnosti)
        if ($include->contains('aktivnosti')) {
            
            if ($include->contains('autori')) {
                $with[] = 'aktivnosti.user';
            }
        }

        // komentari (+ opcioni autor komentara)
        if ($include->contains('komentari')) {
            
            if ($include->contains('autori')) {
                $with[] = 'komentari.user';
            }
        }

        if (!empty($with)) {
            $query->with($with);
        }

        $kosnice = $query->get();

        // Meta sekcija – korisno za naslov PDF-a i filtere
        $meta = [
            'generated_at' => now()->toDateTimeString(),
            'filters' => [
                'kosnica_ids' => $ids,
               
                'include'     => $include,
            ],
            'totals' => [
                'kosnice'     => $kosnice->count(),
                'aktivnosti'  => $kosnice->sum('aktivnosti_count'),
                'komentari'   => $kosnice->sum('komentari_count'),
            ],
        ]; 

        return response()->json([
            'success' => true,
            'meta'    => $meta,
            'data'    => $kosnice,
        ]);
    }










}
