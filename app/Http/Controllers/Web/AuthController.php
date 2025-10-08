<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'eid_number' => 'nullable|string|max:50',
            'eid_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Handle EID file upload
        $eidFilePath = null;
        if ($request->hasFile('eid_file')) {
            $eidFilePath = $request->file('eid_file')->store('eid_files', 'public');
        }

        // Handle profile image upload
        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
        }

        $user = User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'eid_number' => $validated['eid_number'] ?? null,
            'eid_file' => $eidFilePath,
            'profile_image' => $profileImagePath,
            'password' => Hash::make($validated['password']),
        ]);

        // Assign default role (agent/client)
        $user->assignRole('agent');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Account created successfully!');
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'eid_number' => 'nullable|string|max:50',
            'eid_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Handle EID file upload
        if ($request->hasFile('eid_file')) {
            // Delete old file if exists
            if ($user->eid_file && Storage::disk('public')->exists($user->eid_file)) {
                Storage::disk('public')->delete($user->eid_file);
            }
            $validated['eid_file'] = $request->file('eid_file')->store('eid_files', 'public');
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old file if exists
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $validated['profile_image'] = $request->file('profile_image')->store('profile_images', 'public');
        }

        // Update name field based on first, middle, and last names
        $validated['name'] = trim("{$validated['first_name']} {$validated['middle_name']} {$validated['last_name']}");

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
            'status' => session('status'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))->with('success', 'Welcome back! You have successfully logged in.');
    }

    public function showForgotPassword(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function showResetPassword(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
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

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Show the email verification prompt.
     */
    public function showVerifyEmail(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('dashboard'))
            : Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard') . '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(route('dashboard') . '?verified=1');
    }

    /**
     * Send a new email verification notification.
     */
    public function sendVerificationEmail(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
