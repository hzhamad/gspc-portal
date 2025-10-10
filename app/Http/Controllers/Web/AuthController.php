<?php

namespace App\Http\Controllers\Web;

use App\Enums\UserRoles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Rules\ValidatedFile;
use App\Services\OtpService;
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
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

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
            'phone' => 'nullable|string|max:20',
            'eid_number' => 'nullable|string|max:50',
            'eid_file' => ['nullable', new ValidatedFile('document')],
            'profile_picture' => ['nullable', new ValidatedFile('image')],
        ]);

        // Handle EID file upload
        $eidFilePath = null;
        if ($request->hasFile('eid_file')) {
            $eidFilePath = $request->file('eid_file')->store('eid_files', 'public');
        }

        // Handle profile image upload
        $profileImagePath = null;
        if ($request->hasFile('profile_picture')) {
            $profileImagePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $user = User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'eid_number' => $validated['eid_number'] ?? null,
            'eid_file' => $eidFilePath,
            'profile_picture' => $profileImagePath,
        ]);

        // Assign default role (client)
        $user->assignRole(UserRoles::CLIENT->value);

        event(new Registered($user));

        // Send OTP for verification
        $this->otpService->sendOtp($user, 'register');

        // Store user email in session for OTP verification
        session(['otp_email' => $user->email, 'otp_action' => 'register']);

        return redirect()->route('verify-otp')->with('success', 'Registration successful! Please check your email for the verification code.');
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
            'dob' => 'nullable|date|before:today',
            'residency' => 'nullable|string|max:255',
            'eid_number' => 'nullable|string|max:50',
            'eid_file' => ['nullable', new ValidatedFile('document')],
            'profile_picture' => ['nullable', new ValidatedFile('image')],
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
        if ($request->hasFile('profile_picture')) {
            // Delete old file if exists
            if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }


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

    /**
     * Initiate OTP-based login
     */
    public function loginWithOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'No account found with this email address.',
            ]);
        }

        // Check rate limiting
        if (!$this->otpService->canRequestOtp($user)) {
            throw ValidationException::withMessages([
                'email' => 'Too many OTP requests. Please try again later.',
            ]);
        }

        // Send OTP for login
        $this->otpService->sendOtp($user, 'login');

        // Store user email in session for OTP verification
        session(['otp_email' => $user->email, 'otp_action' => 'login']);

        return redirect()->route('verify-otp')->with('success', 'Verification code sent to your email. Please check your inbox.');
    }

    /**
     * Show OTP verification form
     */
    public function showVerifyOtp(): Response|RedirectResponse
    {
        $email = session('otp_email');
        $action = session('otp_action', 'verify');

        if (!$email) {
            return redirect()->route('login')->with('error', 'Session expired. Please try again.');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $email,
            'action' => $action,
        ]);
    }

    /**
     * Verify OTP and complete login/registration
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
        ]);

        $email = session('otp_email');
        $action = session('otp_action', 'verify');

        if (!$email) {
            throw ValidationException::withMessages([
                'otp_code' => 'Session expired. Please try again.',
            ]);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'otp_code' => 'User not found.',
            ]);
        }

        // Verify OTP
        if (!$this->otpService->verifyOtp($user, $request->otp_code)) {
            throw ValidationException::withMessages([
                'otp_code' => 'Invalid or expired verification code.',
            ]);
        }


        // Clear session data
        session()->forget(['otp_email', 'otp_action']);

        // Log in the user
        Auth::login($user);
        $request->session()->regenerate();

        $dashboardRoute = $user->getDashboardRoute();
        $message = $action === 'register'
            ? 'Registration completed successfully! Welcome aboard.'
            : 'Login successful! Welcome back.';

        return redirect()->intended(route($dashboardRoute))->with('success', $message);
    }

    /**
     * Resend OTP code
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        $email = session('otp_email');
        $action = session('otp_action', 'verify');

        if (!$email) {
            return redirect()->route('login')->with('error', 'Session expired. Please try again.');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return redirect()->route('login')->with('error', 'User not found.');
        }

        // Send new OTP
        $this->otpService->sendOtp($user, $action);

        return back()->with('success', 'A new verification code has been sent to your email.');
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

        $dashboardRoute = $request->user()->getDashboardRoute();
        return redirect()->intended(route($dashboardRoute))->with('success', 'Welcome back! You have successfully logged in.');
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
            return back()->with('success', 'Password reset link has been sent to your email!');
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
            return redirect()->route('login')->with('success', 'Your password has been reset successfully! Please login with your new password.');
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
            ? redirect()->intended(route($request->user()->getDashboardRoute()))
            : Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(Request $request): RedirectResponse
    {
        $dashboardRoute = $request->user()->getDashboardRoute();

        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route($dashboardRoute))->with('info', 'Your email is already verified.');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(route($dashboardRoute))->with('success', 'Your email has been verified successfully!');
    }

    /**
     * Send a new email verification notification.
     */
    public function sendVerificationEmail(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route($request->user()->getDashboardRoute()))->with('info', 'Your email is already verified.');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Verification link has been sent to your email!');
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'You have been logged out successfully.');
    }
}
