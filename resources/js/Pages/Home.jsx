import React from "react";
import { router } from "@inertiajs/react";
import UAEHeader from "@/components/UAEHeader";

const gold = "#b68a35";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Top Header */}
      <UAEHeader />

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Health Insurance Portal
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Apply for health insurance coverage for yourself and your dependents.
            Track applications, receive quotes, and manage policies, all in one secure place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.visit("/login")}
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gold"
              style={{ backgroundColor: gold }}
            >
              Get started
              <svg
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-slate-700 font-semibold bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Learn more
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: gold + '15' }}>
                <svg className="w-7 h-7" style={{ color: gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Secure & Compliant</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: gold + '15' }}>
                <svg className="w-7 h-7" style={{ color: gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Fast Processing</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: gold + '15' }}>
                <svg className="w-7 h-7" style={{ color: gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">24/7 Support</h3>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-16 sm:my-20">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500 font-medium">Simple & Secure Process</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section aria-labelledby="how-it-works" className="mx-auto max-w-4xl">
          <h2 id="how-it-works" className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How it works
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Get covered in five simple steps. Our streamlined process ensures you receive the best healthcare coverage quickly and efficiently.
          </p>

          <ol className="space-y-6">
            <li className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: gold }}
              >
                1
              </span>
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">Register & verify</p>
                <p className="text-slate-600">
                  Create your account with Emirates ID and verify your phone number.
                </p>
              </div>
            </li>

            <li className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: gold }}
              >
                2
              </span>
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">Submit application</p>
                <p className="text-slate-600">
                  Provide your details, add dependents, and upload required documents.
                </p>
              </div>
            </li>

            <li className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: gold }}
              >
                3
              </span>
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">Receive quote</p>
                <p className="text-slate-600">
                  Our team reviews your request and sends a tailored quote.
                </p>
              </div>
            </li>

            <li className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: gold }}
              >
                4
              </span>
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">Complete payment</p>
                <p className="text-slate-600">
                  Pay securely using the provided link to proceed.
                </p>
              </div>
            </li>

            <li className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: gold }}
              >
                5
              </span>
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">Access your policy</p>
                <p className="text-slate-600">
                  Download your policy documents anytime from your dashboard.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </main>

    {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} GSPC Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;