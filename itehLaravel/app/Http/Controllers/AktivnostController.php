<?php

namespace App\Http\Controllers;

use App\Models\Aktivnost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AktivnostController extends Controller
{
    public function index()
    {
        $aktivnosti = Aktivnost::where('user_id', auth()->id())->get();

        return response()->json([
            'success' => true,
            'data' => $aktivnosti
        ], 200);
    }

    public function show($id)
    {
        $aktivnost = Aktivnost::where('user_id', auth()->id())->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $aktivnost
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'datum' => 'required|date',
            'tip' => 'required|string|in:sezonska,prilagodjena',
            'opis' => 'nullable|string',
            'dodatne_beleske' => 'nullable|string',
            'kosnica_id' => 'required|exists:kosnicas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $aktivnost = Aktivnost::create(array_merge(
            $validator->validated(),
            ['user_id' => auth()->id()]
        ));

        return response()->json([
            'success' => true,
            'data' => $aktivnost
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $aktivnost = Aktivnost::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'datum' => 'required|date',
            'tip' => 'required|string|in:sezonska,prilagodjena',
            'opis' => 'nullable|string',
            'dodatne_beleske' => 'nullable|string',
            'kosnica_id' => 'required|exists:kosnicas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $aktivnost->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $aktivnost
        ], 200);
    }

    public function destroy($id)
    {
        $aktivnost = Aktivnost::where('user_id', auth()->id())->findOrFail($id);
        $aktivnost->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aktivnost deleted successfully'
        ], 200);
    }


    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'nullable|string|max:255',
            'tip' => 'nullable|string|in:sezonska,prilagodjena',
            'datum_od' => 'nullable|date',
            'datum_do' => 'nullable|date',
            'kosnica_id' => 'nullable|exists:kosnicas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $query = Aktivnost::query();

        // Dodaj uslov za `naziv` ako postoji
        if ($request->filled('naziv')) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%');
        }

        // Dodaj uslov za `tip` ako postoji
        if ($request->filled('tip')) {
            $query->where('tip', $request->tip);
        }

        // Dodaj uslov za opseg datuma
        if ($request->filled('datum_od')) {
            $query->where('datum', '>=', $request->datum_od);
        }

        if ($request->filled('datum_do')) {
            $query->where('datum', '<=', $request->datum_do);
        }

        // Dodaj uslov za `kosnica_id` ako postoji
        if ($request->filled('kosnica_id')) {
            $query->where('kosnica_id', $request->kosnica_id);
        }

        // Filtriranje po korisniku
        $query->where('user_id', auth()->id());

        $aktivnosti = $query->get();

        return response()->json([
            'success' => true,
            'data' => $aktivnosti
        ], 200);
    }

}