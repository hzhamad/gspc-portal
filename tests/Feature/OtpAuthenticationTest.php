<?php

namespace Tests\Feature;

use App\Mail\OtpVerification;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OtpAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected OtpService $otpService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->otpService = new OtpService();
    }

    /** @test */
    public function user_can_register_with_otp()
    {
        Mail::fake();

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email'],
            ]);

        Mail::assertSent(OtpVerification::class, function ($mail) {
            return $mail->hasTo('test@example.com');
        });

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    }

    /** @test */
    public function user_can_login_with_otp()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification code sent to your email. Please check your inbox.',
            ]);

        Mail::assertSent(OtpVerification::class);
    }

    /** @test */
    public function user_can_verify_otp_and_get_token()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        // Send OTP
        $this->otpService->sendOtp($user, 'login');

        $user->refresh();
        $otpCode = $user->otp_code;

        // Verify OTP
        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => 'test@example.com',
            'otp_code' => $otpCode,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'access_token',
                'token_type',
                'expires_in',
            ]);

        // Check that email is verified
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
    }

    /** @test */
    public function otp_verification_fails_with_wrong_code()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $this->otpService->sendOtp($user, 'login');

        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => 'test@example.com',
            'otp_code' => '000000',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid or expired verification code.',
            ]);
    }

    /** @test */
    public function otp_expires_after_10_minutes()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $this->otpService->sendOtp($user, 'login');

        $user->refresh();
        $otpCode = $user->otp_code;

        // Simulate time passing
        $user->update([
            'otp_expires_at' => now()->subMinutes(11),
        ]);

        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => 'test@example.com',
            'otp_code' => $otpCode,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid or expired verification code.',
            ]);
    }

    /** @test */
    public function user_can_resend_otp()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/auth/resend-otp', [
            'email' => 'test@example.com',
            'action' => 'login',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'A new verification code has been sent to your email.',
            ]);

        Mail::assertSent(OtpVerification::class);
    }

    /** @test */
    public function login_fails_for_non_existent_user()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'No account found with this email address.',
            ]);
    }
}

