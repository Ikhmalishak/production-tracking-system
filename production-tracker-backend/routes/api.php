<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\SkuController;
use App\Http\Controllers\API\WipController;
use App\Http\Controllers\API\ScanRecordController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('skus', SkuController::class);
    Route::apiResource('wips', WipController::class);
    Route::apiResource('scans', ScanRecordController::class);
    Route::get('/skus/projects/{projectId}', [SkuController::class, 'getByProject']);
    Route::get('/wips/skus/{skuId}', [WipController::class, 'getBySkuId']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

