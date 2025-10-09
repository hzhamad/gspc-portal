<?php

use App\Http\Controllers\Web\ClientDashboardController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\QuoteRequestController;
use App\Http\Controllers\Web\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');

    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/home', function () {
        return redirect()->route('dashboard');
    });

    // Client Dashboard Route
    Route::get('/client/dashboard', [ClientDashboardController::class, 'index'])->name('client.dashboard');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/email/verify', [AuthController::class, 'showVerifyEmail'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Quote Request Routes (for clients/clients)
    Route::get('/quote-request', [QuoteRequestController::class, 'create'])->name('quote-request.create');
    Route::post('/quote-request', [QuoteRequestController::class, 'store'])->name('quote-request.store');

    // My Requests Routes
    Route::get('/my-requests', [QuoteRequestController::class, 'index'])->name('my-requests.index');
    Route::get('/my-requests/{quoteRequest}', [QuoteRequestController::class, 'show'])->name('my-requests.show');
    Route::get('/my-requests/{quoteRequest}/edit', [QuoteRequestController::class, 'edit'])->name('my-requests.edit');
    Route::put('/my-requests/{quoteRequest}', [QuoteRequestController::class, 'update'])->name('my-requests.update');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/image', [ProfileController::class, 'deleteProfileImage'])->name('profile.deleteImage');
    Route::delete('/profile/eid', [ProfileController::class, 'deleteEidFile'])->name('profile.deleteEid');
});

// Admin Routes - Require authentication and admin role
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
});
