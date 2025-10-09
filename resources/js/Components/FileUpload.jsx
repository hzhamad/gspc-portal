import React, { useState } from 'react';

export default function FileUpload({ 
    label, 
    accept = "image/*,.pdf", 
    onChange, 
    fileName = null,
    placeholder = "Click to upload PNG/JPG/PDF",
    error = null,
    required = false,
    maxSize = 10, // MB
    fileType = 'document' // 'image' or 'document'
}) {
    const [validationError, setValidationError] = useState(null);

    const validateFile = (file) => {
        if (!file) return null;

        const errors = [];

        // File size validation
        const maxBytes = (fileType === 'image' ? 5 : 10) * 1024 * 1024;
        if (file.size > maxBytes) {
            errors.push(`File size must not exceed ${fileType === 'image' ? 5 : 10} MB`);
        }

        if (file.size === 0) {
            errors.push('The uploaded file is empty');
        }

        // File type validation
        const allowedTypes = {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        };

        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const isValidType = Object.entries(allowedTypes).some(([mime, exts]) => 
            file.type === mime && exts.includes(fileExtension)
        );

        if (!isValidType) {
            errors.push('Please upload PDF, DOC, DOCX, JPG, or PNG files only');
        }

        // File name validation
        if (!/^[a-zA-Z0-9\s\-_.]+$/.test(file.name)) {
            errors.push('File name contains invalid characters');
        }

        if (file.name.length > 255) {
            errors.push('File name is too long');
        }

        return errors.length > 0 ? errors[0] : null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setValidationError(null);

        if (!file) {
            onChange(e);
            return;
        }

        const error = validateFile(file);
        if (error) {
            setValidationError(error);
            e.target.value = ''; // Clear the input
            return;
        }

        onChange(e);
    };

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
                    onChange={handleFileChange}
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
            {(error || validationError) && (
                <p className="mt-2 text-sm text-red-600">{error || validationError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
                Max size: {fileType === 'image' ? '5' : '10'}MB. Allowed: PDF, DOC, DOCX, JPG, PNG
            </p>
        </div>
    );
}