<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    // Prikaz svih uloga
    public function index()
    {
        $roles = Role::all();

        return response()->json([
            'success' => true,
            'data' => $roles
        ], 200);
    }

    // Kreiranje nove uloge
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255|unique:roles,naziv',
            'opis' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $role = Role::create($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $role
        ], 201);
    }

    // Prikaz detalja određene uloge
    public function show($id)
    {
        $role = Role::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $role
        ], 200);
    }

    // Ažuriranje uloge
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255|unique:roles,naziv,' . $role->id,
            'opis' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $role->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $role
        ], 200);
    }

    // Brisanje uloge
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully'
        ], 200);
    }


















 
    // Dodeljivanje uloge korisniku
    public function assignRoleToUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($request->user_id);  //pronalazi usera iz baze
        $user->role_id = $request->role_id;//azurira mu ulogu
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Role assigned to user successfully',
            'user' => $user
        ], 200);
    }

 

 
    // Prikaz svih korisnika sa određenom ulogom
    public function usersByRole($roleId)
    {
        $users = User::where('role_id', $roleId)->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }

}
