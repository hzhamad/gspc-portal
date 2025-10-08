import React from "react";
import { router } from "@inertiajs/react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Simple geometric background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
            </div>
            
            {/* Main content container */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
                {/* Header Section */}
                <header className="text-center mb-20">
                    <div className="inline-block mb-6">
                        <img 
                            src="/images/uae_logo.svg" 
                            alt="UAE Logo" 
                            className="w-20 h-20 md:w-24 md:h-24 mx-auto drop-shadow-lg"
                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Health Insurance Portal
                    </h1>
                    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                        Apply for health insurance coverage for yourself and your dependents. 
                        Track your applications, receive quotes, and manage your policies all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.visit("/login")}
                            className="inline-flex items-center justify-center px-8 py-4 bg-gold text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-gold-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Get Started
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        {/* <button
                            onClick={() => router.visit("/login")}
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gold text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gold transition-all duration-300"
                        >
                            Sign In
                        </button> */}
                    </div>
                </header>
                
                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Application</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Submit insurance applications for yourself or dependents with our streamlined process. Upload Emirates ID and required documents easily.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Track Requests</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Monitor your insurance applications in real-time. View quotes, payment links, and updates from our production team instantly.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Secure & Verified</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your data is protected with advanced security. Phone verification via OTP/WhatsApp ensures authentic communication.
                        </p>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="max-w-4xl w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Register & Verify</h4>
                                <p className="text-gray-600">Create your account with Emirates ID and verify your phone number.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Submit Application</h4>
                                <p className="text-gray-600">Apply for insurance coverage and add dependents if needed.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Receive Quote</h4>
                                <p className="text-gray-600">Our team reviews your application and sends you a customized quote.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Complete Payment</h4>
                                <p className="text-gray-600">Pay securely through the payment link sent via WhatsApp.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Get Your Policy</h4>
                                <p className="text-gray-600">Access your completed policy documents in your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="mt-16 text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} GSPC Portal. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Home;
