<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:60,1'])->group(function () {
    // OTP-based authentication
    Route::post('/auth/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.login');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])->name('api.verify-otp');
    Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp'])->name('api.resend-otp');

    // Password reset
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->name('api.password.email');
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('api.password.update');
    Route::post('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('api.verification.verify');
});

Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::delete('/auth/logout-all', [AuthController::class, 'logoutAll'])->name('api.logout.all');
    Route::get('/auth/user', [AuthController::class, 'user'])->name('api.user');
    Route::post('/auth/refresh', [AuthController::class, 'refresh'])->name('api.refresh');
    Route::post('/auth/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('api.verification.send');
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
})->name('api.health');
