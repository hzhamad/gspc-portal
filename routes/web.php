<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\QuoteRequestController;
use App\Http\Controllers\Web\ClientDashboardController;
use App\Http\Controllers\Web\AdminQuoteRequestController;
use App\Http\Controllers\Web\AdminQuoteRequestRecipientsController;


Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.authenticate');
    Route::post('/login/otp', [AuthController::class, 'loginWithOtp'])->name('login.otp');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/verify-otp', [AuthController::class, 'showVerifyOtp'])->name('verify-otp');
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp'])->name('resend-otp');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');

    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

    // Google OAuth Routes
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

Route::middleware(['auth'])->group(function () {
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

    // Quote Request Routes (for clients)
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

    // Password Change Routes
    Route::get('/profile/password', [ProfileController::class, 'editPassword'])->name('profile.password.edit');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

// Admin Routes - Require authentication and admin role
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');

    // User Management Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Quote Request Management Routes
    Route::get('/quote-requests', [AdminQuoteRequestController::class, 'index'])->name('quote-requests.index');
    Route::get('/quote-requests/{quoteRequest}', [AdminQuoteRequestController::class, 'show'])->name('quote-requests.show');
    Route::post('/quote-requests/{quoteRequest}/upload-quote', [AdminQuoteRequestController::class, 'uploadQuote'])->name('quote-requests.upload-quote');
    Route::post('/quote-requests/{quoteRequest}/upload-policy', [AdminQuoteRequestController::class, 'uploadPolicy'])->name('quote-requests.upload-policy');
    Route::patch('/quote-requests/{quoteRequest}/status', [AdminQuoteRequestController::class, 'updateStatus'])->name('quote-requests.update-status');
});

// Super Admin Routes - Require authentication and super-admin role
Route::middleware(['auth', 'super-admin'])->group(function () {
    Route::get('/admin/quote-recipients', [AdminQuoteRequestRecipientsController::class, 'index'])->name('admin.quote-recipients.index');
    Route::post('/admin/quote-recipients', [AdminQuoteRequestRecipientsController::class, 'store'])->name('admin.quote-recipients.store');
    Route::patch('/admin/quote-recipients/{recipient}', [AdminQuoteRequestRecipientsController::class, 'update'])->name('admin.quote-recipients.update');
    Route::delete('/admin/quote-recipients/{recipient}', [AdminQuoteRequestRecipientsController::class, 'destroy'])->name('admin.quote-recipients.destroy');
});
