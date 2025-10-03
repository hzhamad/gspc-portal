<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            event(new Registered($user));

            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user->only(['id', 'name', 'email', 'email_verified_at']),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60, // 30 days in seconds
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Authenticate user and return token
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            // Revoke old tokens if needed (optional - uncomment if you want single session)
            // $user->tokens()->delete();

            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user->only(['id', 'name', 'email', 'email_verified_at']),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60, // 30 days in seconds
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->only(['id', 'name', 'email', 'email_verified_at']),
        ]);
    }

    /**
     * Refresh user token
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentToken = $request->user()->currentAccessToken();

        // Delete current token
        $currentToken->delete();

        // Create new token
        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 30 * 24 * 60 * 60,
        ]);
    }

    /**
     * Logout user (revoke current token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices successfully',
        ]);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Password reset link sent to your email',
                ]);
            }

            return response()->json([
                'message' => 'Unable to send reset link. Please check your email address.',
            ], 400);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send reset link',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();

                    // Revoke all existing tokens for security
                    $user->tokens()->delete();

                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'Password reset successful',
                ]);
            }

            return response()->json([
                'message' => 'Password reset failed',
                'error' => __($status),
            ], 400);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Password reset failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals((string) $request->route('id'), (string) $user->getKey())) {
            return response()->json(['message' => 'Invalid verification link'], 400);
        }

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['message' => 'Email verified successfully']);
    }

    /**
     * Send email verification notification
     */
    public function sendVerificationEmail(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent']);
    }
}
