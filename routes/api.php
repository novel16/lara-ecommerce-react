<?php

use App\Http\Controllers\V1\Frontend\CartController;
use App\Http\Controllers\V1\Frontend\FrontendController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::prefix("V1")->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::post('login', [App\Http\Controllers\V1\Auth\AuthController::class, 'login']);
    Route::post('register', [App\Http\Controllers\V1\Auth\AuthController::class, 'register']);
    Route::post('logout', [App\Http\Controllers\V1\Auth\AuthController::class, 'logout'])->middleware('auth:sanctum');

    // frontend routes
    Route::get('products', [FrontendController::class, 'index'])->name('products');
    Route::get('products/{product}', [FrontendController::class, 'viewProduct'])->name('products');
    Route::post('addtocart', [CartController::class,'addToCart'])
        ->middleware('auth:sanctum');

    Route::get('viewcart', [CartController::class,'viewCart'])
        ->middleware('auth:sanctum');

    Route::put('addqty/{cartItem}', [CartController::class,'increaseCartQty'])
        ->middleware('auth:sanctum');

    Route::put('minusqty/{cartItem}', [CartController::class,'decreaseCartQty'])
        ->middleware('auth:sanctum');

    Route::prefix("admin")->middleware('auth:sanctum')->group(function () {
        Route::apiResource('products', App\Http\Controllers\V1\Admin\ProductController::class);
        Route::apiResource('stocks', App\Http\Controllers\V1\Admin\StockController::class);
    });
});
