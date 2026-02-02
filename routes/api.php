<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::prefix("V1")->group(function () {
    Route::prefix("admin")->group(function () {
        Route::apiResource('products', App\Http\Controllers\V1\Admin\ProductController::class);
    });
});