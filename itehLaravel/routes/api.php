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


    Route::apiResource('aktivnosti', AktivnostController::class);


    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

    Route::post('/roles/assign', [RoleController::class, 'assignRoleToUser']);
    Route::post('/roles/remove', [RoleController::class, 'removeRoleFromUser']);
    Route::get('/roles/{roleId}/users', [RoleController::class, 'usersByRole']);
});