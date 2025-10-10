import React, { useState, useEffect } from 'react';

export default function PhoneInput({
    label,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    placeholder = "XXXXXXXXX",
    helperText = ""
}) {
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        // Validate phone number length
        if (value && value.length > 0 && value.length < 9) {
            setValidationError('Phone number must be exactly 9 digits');
        } else {
            setValidationError('');
        }
    }, [value]);

    const handleChange = (e) => {
        let inputValue = e.target.value;
        // Remove all non-digit characters
        inputValue = inputValue.replace(/\D/g, '');

        // If user pasted with 971 prefix, remove it
        if (inputValue.startsWith('971')) {
            inputValue = inputValue.substring(3);
        }

        // Limit to 9 digits (UAE mobile numbers)
        if (inputValue.length > 9) {
            inputValue = inputValue.substring(0, 9);
        }

        onChange(inputValue);
    };

    const displayError = error || validationError;

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <img
                        src="/images/uae-flag.svg"
                        alt="UAE"
                        className="w-6 h-4 object-contain"
                    />
                    <span className="text-gray-700 font-medium">+971-</span>
                </div>
                <input
                    type="tel"
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all pl-24 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={placeholder}
                    required={required}
                    minLength={9}
                    maxLength={9}
                />
            </div>
            {helperText && !displayError && (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {displayError && (
                <p className="text-red-600 text-sm mt-1">{displayError}</p>
            )}
        </div>
    );
}
