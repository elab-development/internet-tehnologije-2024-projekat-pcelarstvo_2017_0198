<?php

namespace App\Http\Controllers;

use App\Models\Aktivnost;
use App\Models\Kosnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KosnicaController extends Controller
{
    public function index(Request $request)
    {
        // Validacija parametara za filtriranje i paginaciju
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255', // Za pretragu po nazivu ili opisu
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }
    
        // Dohvatanje košnica koje pripadaju ulogovanom korisniku
        $query = Kosnica::where('user_id', auth()->id());
    
        // Primena pretrage po nazivu ili opisu
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('naziv', 'like', "%{$searchTerm}%")
                  ->orWhere('opis', 'like', "%{$searchTerm}%");
            });
        }
    
        $perPage = $request->get('per_page', 10); // Default: 10 stavki po stranici
        $kosnice = $query->paginate($perPage);
    
        return response()->json([
            'success' => true,
            'data' => $kosnice
        ], 200);
    }
    
    

    public function show($id)
    {
        $kosnica = Kosnica::where('user_id', auth()->id())->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $kosnica
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $kosnica = Kosnica::create(array_merge(
            $validator->validated(),
            ['user_id' => auth()->id()]
        ));

        return response()->json([
            'success' => true,
            'data' => $kosnica
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kosnica = Kosnica::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $kosnica->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $kosnica
        ], 200);
    }

    public function destroy($id)
    {
        $kosnica = Kosnica::where('user_id', auth()->id())->findOrFail($id);
        $kosnica->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kosnica deleted successfully'
        ], 200);
    }
}
