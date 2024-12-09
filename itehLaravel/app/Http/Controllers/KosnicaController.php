<?php

namespace App\Http\Controllers;

use App\Models\Kosnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KosnicaController extends Controller
{
    public function index()
    {
        $kosnice = Kosnica::where('user_id', auth()->id())->get();

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
