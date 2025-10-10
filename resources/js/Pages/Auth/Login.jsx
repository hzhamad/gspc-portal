import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import UAEHeader from '@/Components/UAEHeader';

export default function Login({ status, canResetPassword }) {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'

    const passwordForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const otpForm = useForm({
        email: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submitPasswordLogin = (e) => {
        e.preventDefault();
        passwordForm.post('/login', {
            onFinish: () => passwordForm.reset('password'),
        });
    };

    const submitOtpLogin = (e) => {
        e.preventDefault();
        otpForm.post('/login/otp', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Sign In" />

            <div className="min-h-screen bg-[#F8FAFC]">
                <UAEHeader />

                <div className="flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200">
                                <div className="text-sm text-green-700">{status}</div>
                            </div>
                        )}

                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                                <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue</p>
                            </div>

                            {/* Login Method Toggle */}
                            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('password')}
                                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                                        loginMethod === 'password'
                                            ? 'bg-white text-gray-800 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Email & Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('otp')}
                                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                                        loginMethod === 'otp'
                                            ? 'bg-white text-gray-800 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Email & OTP
                                </button>
                            </div>

                            {/* Password Login Form */}
                            {loginMethod === 'password' && (
                                <form onSubmit={submitPasswordLogin} className="space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={passwordForm.data.email}
                                            onChange={(e) => passwordForm.setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                        {passwordForm.errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{passwordForm.errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all pr-12"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{passwordForm.errors.password}</p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={passwordForm.data.remember}
                                                onChange={(e) => passwordForm.setData('remember', e.target.checked)}
                                                className="rounded border-gray-300 text-gold focus:ring-gold"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                        </label>

                                        {canResetPassword && (
                                            <Link href="/forgot-password" className="text-sm text-gold hover:brightness-110">
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {passwordForm.processing && (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        Sign In
                                    </button>
                                </form>
                            )}

                            {/* OTP Login Form */}
                            {loginMethod === 'otp' && (
                                <form onSubmit={submitOtpLogin} className="space-y-6">
                                    <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <div className="text-sm text-gray-800">
                                                <p className="font-semibold mb-1 text-gold">Passwordless Login</p>
                                                <p>Enter your email and we'll send you a verification code to login securely.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="otp-email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="otp-email"
                                            type="email"
                                            value={otpForm.data.email}
                                            onChange={(e) => otpForm.setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                        {otpForm.errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{otpForm.errors.email}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={otpForm.processing}
                                        className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {otpForm.processing && (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        Send Verification Code
                                    </button>

                                    <div className="text-center text-sm text-gray-600">
                                        <p>A 6-digit code will be sent to your email</p>
                                    </div>
                                </form>
                            )}

                            {/* Register Link */}
                            <div className="text-center pt-4 border-t border-gray-200 mt-6">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="text-gold font-semibold hover:brightness-110">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>© 2025 Government Services & Processing Center. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
