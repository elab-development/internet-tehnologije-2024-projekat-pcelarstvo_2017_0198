<?php

namespace App\Http\Controllers;

use App\Models\Komentar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KomentarController extends Controller
{
    // Prikazuje sve komentare
    public function index(Request $request)
    {
    $validator = Validator::make($request->all(), [
        'kosnica_id' => 'required|exists:kosnicas,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $kosnicaId = $request->kosnica_id;

    // Dohvatanje komentara za određenu košnicu koje je kreirao ulogovani korisnik
    $komentari = Komentar::with('user')
    ->where('kosnica_id', $kosnicaId)
    ->get();

    return response()->json([
        'success' => true,
        'data' => $komentari
    ], 200);
}


    // Prikazuje jedan komentar na osnovu ID-a
    public function show($id)
    {
        $komentar = Komentar::where('user_id', auth()->id())->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $komentar
        ], 200);
    }

    // Kreira novi komentar
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sadrzaj' => 'required|string|max:255',
            'datum' => 'required|date',
            'kosnica_id' => 'required|exists:kosnicas,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $komentar = Komentar::create([
            'sadrzaj' => $request->sadrzaj,
            'datum' => $request->datum,
            'kosnica_id' => $request->kosnica_id,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $komentar
        ], 201);
    }

    // Ažurira postojeći komentar
    public function update(Request $request, $id)
    {
        $komentar = Komentar::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'sadrzaj' => 'required|string|max:255',
            'datum' => 'required|date',
            'kosnica_id' => 'required|exists:kosnicas,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $komentar->update([
            'sadrzaj' => $request->sadrzaj,
            'datum' => $request->datum,
            'kosnica_id' => $request->kosnica_id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $komentar
        ], 200);
    }

    // Briše postojeći komentar
    public function destroy($id)
    {
        $komentar = Komentar::where('user_id', auth()->id())->findOrFail($id);
        $komentar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Komentar uspešno obrisan.'
        ], 200);
    }
}
