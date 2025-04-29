<?php

use App\Http\Controllers\API\SkuController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ScanRecordController;
use App\Http\Controllers\API\WipController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('projects', controller: ProjectController::class);
Route::apiResource('skus', controller: SkuController::class);
Route::apiResource('wips', controller: WipController::class);
Route::apiResource('scans', controller: ScanRecordController::class);

// route to get sku by project id
Route::get('/skus/projects/{projectId}', [SkuController::class, 'getByProject']);
Route::get('/wips/skus/{skuId}', [WipController::class, 'getBySkuId']);

// Protected routes
// Route::middleware('auth:sanctum')->group(function () {

// });
