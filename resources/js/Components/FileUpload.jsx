import React from 'react';

export default function FileUpload({ 
    label, 
    accept = "image/*,.pdf", 
    onChange, 
    fileName = null,
    placeholder = "Click to upload PNG/JPG/PDF",
    error = null,
    required = false
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gold transition-all cursor-pointer">
                <input
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    required={required}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center pointer-events-none">
                    {fileName ? (
                        <>
                            <svg className="w-8 h-8 mx-auto text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-700 font-medium">{fileName}</p>
                        </>
                    ) : (
                        <>
                            {accept.includes('image') ? (
                                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            )}
                            <p className="text-sm text-gray-500">{placeholder}</p>
                        </>
                    )}
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
