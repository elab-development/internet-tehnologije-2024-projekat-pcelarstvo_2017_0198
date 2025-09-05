<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AktivnostController;
use App\Http\Controllers\KomentarController;
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
   
    Route::get('/komentari', [KomentarController::class, 'index']);
    Route::get('/komentari/{id}', [KomentarController::class, 'show']);
    Route::post('/komentari', [KomentarController::class, 'store']);
    Route::put('/komentari/{id}', [KomentarController::class, 'update']);
    Route::delete('/komentari/{id}', [KomentarController::class, 'destroy']);
 
    // Rute dostupne samo za admin korisnike
    Route::middleware(['role:1'])->group(function () {  //role id 1 je admin
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::put('/roles/{id}', [RoleController::class, 'update']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

       
        Route::post('/roles/assign', [RoleController::class, 'assignRoleToUser']);
    
        
        Route::get('/roles/{roleId}/users', [RoleController::class, 'usersByRole']);


         Route::get('/admin/kosnice', [KosnicaController::class, 'indexAdmin']);
        Route::post('/admin/aktivnosti', [AktivnostController::class, 'adminStore']);

        Route::get('/admin/users-stats', [AdminController::class, 'usersStats']);
        Route::get('/admin/kosnice-stats', [AdminController::class, 'kosniceStats']);
        Route::get('/admin/aktivnosti-stats', [AdminController::class, 'aktivnostiStats']);
        Route::get('/admin/komentari-stats', [AdminController::class, 'komentariStats']);
        Route::post('/admin/aktivnosti-date-range', [AdminController::class, 'aktivnostiByDateRange']);


        Route::get('/admin/reports/kosnice', [AdminController::class, 'exportKosniceReport']);


    });


    Route::middleware(['role:2'])->group(function () { //role id 2 je pcelar
        Route::post('/kosnice', [KosnicaController::class, 'store']);
        Route::put('/kosnice/{id}', [KosnicaController::class, 'update']);
        Route::delete('/kosnice/{id}', [KosnicaController::class, 'destroy']);

        Route::get('/aktivnosti/search', [AktivnostController::class, 'search']);
        Route::apiResource('aktivnosti', AktivnostController::class);
    });
 
    
});



