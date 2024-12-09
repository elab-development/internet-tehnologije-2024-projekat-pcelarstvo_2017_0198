<?php

use App\Http\Controllers\AktivnostController;
use App\Http\Controllers\KosnicaController;
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
});