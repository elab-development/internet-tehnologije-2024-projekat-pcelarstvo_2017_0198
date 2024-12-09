<?php

use App\Http\Controllers\AktivnostController;
use App\Http\Controllers\KosnicaController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; 
use App\Http\Controllers\UserController;
 


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/kosnice', [KosnicaController::class, 'index']);
    Route::get('/kosnice/{id}', [KosnicaController::class, 'show']);
    Route::post('/kosnice', [KosnicaController::class, 'store']);
    Route::put('/kosnice/{id}', [KosnicaController::class, 'update']);
    Route::delete('/kosnice/{id}', [KosnicaController::class, 'destroy']);

    Route::get('/aktivnosti/search', [AktivnostController::class, 'search']);
    Route::apiResource('aktivnosti', AktivnostController::class);

    // Rute dostupne samo za admin korisnike
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::put('/roles/{id}', [RoleController::class, 'update']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
    });

    // Rute dostupne za admin i moderator korisnike
    Route::middleware(['role:admin,moderator'])->group(function () {
        Route::post('/roles/assign', [RoleController::class, 'assignRoleToUser']);
        Route::post('/roles/remove', [RoleController::class, 'removeRoleFromUser']);
    });

    // Rute dostupne svima sa određenim ulogama
    Route::middleware(['role:admin,moderator,user'])->group(function () {
        Route::get('/roles/{id}', [RoleController::class, 'show']);
        Route::get('/roles/{roleId}/users', [RoleController::class, 'usersByRole']);
    });
    
});



