import React from 'react';

export default function UAEHeader() {
    return (
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-3">
                    <img 
                        src="/images/uae_logo.svg" 
                        alt="UAE Logo" 
                        className="w-12 h-12"
                    />
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">
                            Government Services & Processing Center
                        </h1>
                        <p className="text-xs text-gray-500">Health Insurance Portal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
