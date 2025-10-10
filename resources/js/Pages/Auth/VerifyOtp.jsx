import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import UAEHeader from '@/Components/UAEHeader';

export default function VerifyOtp({ email, action }) {
    const { data, setData, post, processing, errors } = useForm({
        otp_code: '',
    });

    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const submit = (e) => {
        e.preventDefault();
        post('/verify-otp', {
            preserveScroll: true,
            onError: () => {
                setData('otp_code', '');
            },
        });
    };

    const resendOtp = () => {
        router.post('/resend-otp', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setTimeLeft(600);
                setCanResend(false);
            },
        });
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('otp_code', value);
    };

    return (
        <>
            <Head title="Verify OTP" />

            <div className="min-h-screen bg-[#F8FAFC]">
                <UAEHeader />

                <div className="flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    Verify Your Email
                                </h2>
                                <p className="text-gray-600">
                                    We've sent a 6-digit verification code to
                                </p>
                                <p className="font-semibold text-gray-800 mt-1">{email}</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="otp_code" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        id="otp_code"
                                        type="text"
                                        value={data.otp_code}
                                        onChange={handleOtpChange}
                                        maxLength="6"
                                        inputMode="numeric"
                                        pattern="[0-9]{6}"
                                        placeholder="000000"
                                        className={`w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all font-mono ${
                                            errors.otp_code ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoFocus
                                        required
                                    />
                                    {errors.otp_code && (
                                        <p className="mt-2 text-sm text-red-600 text-center">{errors.otp_code}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                                    <span className="text-gray-600">
                                        Code expires in:
                                    </span>
                                    <span className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || data.otp_code.length !== 6}
                                    className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 mb-3">
                                    Didn't receive the code?
                                </p>
                                <button
                                    onClick={resendOtp}
                                    disabled={!canResend && timeLeft > 0}
                                    className="text-gold hover:brightness-110 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                >
                                    Resend Code
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-semibold mb-1">Important Security Notice</p>
                                        <p>Do not share this code with anyone. It will expire in 10 minutes.</p>
                                    </div>
                                </div>
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

