import React from 'react';

export default function UAEHeader() {
  const CONTACT_NUMBER = "+971 4 123 4567"; // replace with real number

  return (
    <div className="w-full bg-gold border-b-2 border-gold shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
          {/* LEFT: Logo */}
          <div className="flex items-center justify-start">
            <a href="/" aria-label="Go to homepage">
              <img
                src="/images/uae_logo.svg"
                alt="UAE Emblem"
                className="w-14 h-18 object-contain drop-shadow"
              />
            </a>
          </div>

          {/* CENTER: Title (perfectly centered) */}
          <div className="flex items-center ">
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-white tracking-wide drop-shadow-md">
                <span className="block">Government Services &amp;</span>
                <span className="block">Processing Center</span>
              </h1>
            </div>
          </div>

        {/* RIGHT: Contact rectangle */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label={`Support number ${CONTACT_NUMBER}`}
              onClick={() => {}}
              className="group relative inline-flex items-center gap-3 rounded-full bg-white
                         pl-4 pr-6 py-3 text-sm font-medium shadow-xl
                         hover:shadow-2xl hover:bg-gradient-to-r hover:from-white hover:to-amber-50
                         transform transition-all duration-300 ease-out
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold
                         border-2 border-gold"
            >
              {/* Icon Circle */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold
                            group-hover:rotate-12 transition-all duration-300 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] font-medium text-gold uppercase tracking-widest">24/7 Support</span>
                <span className="text-sm font-bold text-gray-900 tracking-wide">{CONTACT_NUMBER}</span>
              </div>

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
