<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Public category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::middleware(['auth:api'])->group(function () {

    Route::middleware('admin')->group(function () {

        // Admin stats & orders
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/orders', [AdminController::class, 'orders']);
        Route::patch('/admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);

        // Product CRUD (admin only)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Category CRUD (admin only for write operations)
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });

    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/my-orders', [OrderController::class, 'myOrders']);

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/cart', [CartController::class, 'getCart']);

    Route::post('/cart/add', [CartController::class, 'addToCart']);

    Route::put('/cart/items/{id}', [CartController::class, 'updateQuantity']);

    Route::delete('/cart/remove/{id}', [CartController::class, 'removeFromCart']);

    Route::delete('/cart/clear', [CartController::class, 'clearCart']);
});