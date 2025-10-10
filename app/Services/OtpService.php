<?php

namespace App\Services;

use App\Mail\OtpVerification;
use App\Models\User;
use App\Models\UserOtp;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class OtpService
{
    /**
     * Generate a random 6-digit OTP code
     */
    public function generateOtpCode(): string
    {
        return str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Send OTP to user's email
     */
    public function sendOtp(User $user, string $action = 'verify'): UserOtp
    {
        // Invalidate any previous unverified OTPs for this user
        $user->otps()->unverified()->update(['verified_at' => now()]);

        $otpCode = $this->generateOtpCode();

        // Create new OTP record
        $otp = $user->otps()->create([
            'otp_code' => $otpCode,
            'type' => $action,
            'expires_at' => Carbon::now()->addMinutes(10),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Send email with OTP
        Mail::to($user->email)->send(new OtpVerification($user, $otpCode, $action));

        return $otp;
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(User $user, string $otpCode): bool
    {
        // Find valid OTP
        $otp = $user->otps()
            ->where('otp_code', $otpCode)
            ->valid()
            ->latest()
            ->first();

        if (!$otp) {
            return false;
        }

        // Mark OTP as verified
        $otp->markAsVerified();

        // Mark user's email as verified if not already
//        if (!$user->email_verified_at) {
//            $user->update(['email_verified_at' => now()]);
//        }

        return true;
    }

    /**
     * Clean up expired OTPs (for scheduled task)
     */
    public function cleanupExpiredOtps(): int
    {
        return UserOtp::expired()
            ->where('created_at', '<', now()->subDays(7))
            ->delete();
    }

    /**
     * Get remaining attempts for user (rate limiting)
     */
    public function getRemainingAttempts(User $user, int $maxAttempts = 5, int $timeWindowMinutes = 60): int
    {
        $attempts = $user->otps()
            ->where('created_at', '>', now()->subMinutes($timeWindowMinutes))
            ->count();

        return max(0, $maxAttempts - $attempts);
    }

    /**
     * Check if user can request OTP
     */
    public function canRequestOtp(User $user): bool
    {
        return $this->getRemainingAttempts($user) > 0;
    }
}
