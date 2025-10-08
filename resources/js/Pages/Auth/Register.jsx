import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UAEHeader from '@/Components/UAEHeader';
import FileUpload from '@/Components/FileUpload';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        eid_file: null,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle phone number input to maintain +971- prefix
    const handlePhoneChange = (e) => {
        let value = e.target.value;
        
        // Remove all non-digits
        value = value.replace(/\D/g, '');
        
        // If it starts with 971, format it properly
        if (value.startsWith('971')) {
            value = value.substring(3);
        }
        
        setData('phone', value);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Prepare data with +971 prefix for phone
        const submitData = {
            ...data,
            phone: `+971${data.phone}`
        };
        
        post('/register', {
            data: submitData,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Sign Up" />

            <div className="min-h-screen bg-[#F8FAFC]">
                <UAEHeader />

                <div className="flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                                <p className="text-gray-600 mt-2">Join us to access health insurance services</p>
                                <p className="text-sm text-gray-500 mt-3">
                                    <span className="text-red-600">*</span> Indicates required field
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="First name"
                                            required
                                        />
                                        {errors.first_name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Middle Name <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Middle name"
                                        />
                                        {errors.middle_name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.middle_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Last name"
                                            required
                                        />
                                        {errors.last_name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email & Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                                <img src="/images/uae-flag.svg" alt="UAE" className="w-6 h-4 object-contain" />
                                                <span className="text-gray-700 font-medium">+971-</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={handlePhoneChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all pl-24"
                                                placeholder="XXXXXXXXX"
                                                required
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all pr-12"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {showPassword ? (
                                                        <>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </>
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all pr-12"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {showConfirmPassword ? (
                                                        <>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </>
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Emirates ID Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Emirates ID Information <span className="text-red-600">*</span>
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <FileUpload
                                                label="Emirates ID Copy"
                                                accept="image/*,.pdf"
                                                onChange={(e) => setData('eid_file', e.target.files[0])}
                                                fileName={data.eid_file?.name}
                                                placeholder="Upload EID copy (PNG/JPG/PDF)"
                                                error={errors.eid_file}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing && (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Create Account
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-gold font-semibold hover:brightness-110">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </form>
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
