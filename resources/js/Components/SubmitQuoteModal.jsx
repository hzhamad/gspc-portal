import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';

export default function SubmitQuoteModal({ isOpen, onClose, requestId }) {
    const form = useForm({
        quote_file: null,
            premium_file: null,
        payment_link: '',
        admin_notes: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedPremiumFileName, setSelectedPremiumFileName] = useState('');
    const fileInputRef = useRef(null);
    const premiumFileInputRef = useRef(null);

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
            setValidationErrors({});
            setSelectedFileName('');
                setSelectedPremiumFileName('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
                if (premiumFileInputRef.current) {
                    premiumFileInputRef.current.value = '';
                }
        }
    }, [isOpen]);

    const validateForm = () => {
        const errors = {};

        // Validate quote file
        if (!form.data.quote_file) {
            errors.quote_file = 'Quote file is required';
        } else {
            const file = form.data.quote_file;
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!validTypes.includes(file.type)) {
                errors.quote_file = 'File must be PDF, DOC, or DOCX format';
            } else if (file.size > maxSize) {
                errors.quote_file = 'File size must not exceed 10MB';
            }
        }

        // Validate premium file (optional)
        if (form.data.premium_file) {
            const pfile = form.data.premium_file;
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!validTypes.includes(pfile.type)) {
                errors.premium_file = 'Premium file must be PDF, DOC, or DOCX format';
            } else if (pfile.size > maxSize) {
                errors.premium_file = 'Premium file size must not exceed 10MB';
            }
        }

        // Validate payment link (if provided)
        if (form.data.payment_link && form.data.payment_link.trim() !== '') {
            const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
            if (!urlPattern.test(form.data.payment_link)) {
                errors.payment_link = 'Please enter a valid URL (must start with http:// or https://)';
            }
        }

        // Validate admin notes (optional but with max length)
        if (form.data.admin_notes && form.data.admin_notes.length > 1000) {
            errors.admin_notes = 'Notes must not exceed 1000 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('quote_file', file);
            setSelectedFileName(file.name);
            // Clear the quote_file error when a new file is selected
            if (validationErrors.quote_file) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.quote_file;
                    return newErrors;
                });
            }
        }
    };

    const handlePremiumFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('premium_file', file);
            setSelectedPremiumFileName(file.name);
            // Clear the premium_file error when a new file is selected
            if (validationErrors.premium_file) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.premium_file;
                    return newErrors;
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        // Validate form
        if (!validateForm()) {
            console.log('Validation failed:', validationErrors);
            return;
        }

        console.log('Submitting quote with data:', {
            has_file: !!form.data.quote_file,
            file_name: form.data.quote_file?.name,
            file_size: form.data.quote_file?.size,
            file_type: form.data.quote_file?.type,
            premium_file_name: form.data.premium_file?.name,
            premium_file_size: form.data.premium_file?.size,
            premium_file_type: form.data.premium_file?.type,
            payment_link: form.data.payment_link,
            admin_notes: form.data.admin_notes,
            requestId: requestId
        });

        // Submit the form
        form.post(`/admin/quote-requests/${requestId}/upload-quote`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                console.log('Quote submitted successfully');
                handleClose();
            },
            onError: (errors) => {
                console.error('Server validation errors:', errors);
                // Set server-side validation errors
                setValidationErrors(errors);
            },
        });
    };

    const handleClose = () => {
        form.reset();
        setValidationErrors({});
        setSelectedFileName('');
        setSelectedPremiumFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (premiumFileInputRef.current) {
            premiumFileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Submit Quote</h2>
                        <button
                            onClick={handleClose}
                            disabled={form.processing}
                            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Quote File Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quote File <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    disabled={form.processing}
                                    className={`block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed ${
                                        validationErrors.quote_file || form.errors.quote_file
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                    }`}
                                />
                                {selectedFileName && (
                                    <p className="mt-1 text-xs text-green-600">Selected: {selectedFileName}</p>
                                )}
                            </div>
                            {(validationErrors.quote_file || form.errors.quote_file) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {validationErrors.quote_file || form.errors.quote_file}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Accepted formats: PDF, DOC, DOCX (Max 10MB)
                            </p>
                            <p className="mt-1 text-xs text-gray-500 italic">Tip: This is the Benefits</p>
                        </div>

                        {/* Premium File Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Premium File <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    ref={premiumFileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handlePremiumFileChange}
                                    disabled={form.processing}
                                    required={true}
                                    className={`block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed ${
                                        validationErrors.premium_file || form.errors.premium_file
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                    }`}
                                />
                                {selectedPremiumFileName && (
                                    <p className="mt-1 text-xs text-green-600">Selected: {selectedPremiumFileName}</p>
                                )}
                            </div>
                            {(validationErrors.premium_file || form.errors.premium_file) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {validationErrors.premium_file || form.errors.premium_file}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Accepted formats: PDF, DOC, DOCX (Max 10MB)
                            </p>
                        </div>

                        {/* Payment Link Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Link
                            </label>
                            <input
                                type="url"
                                required={true}
                                value={form.data.payment_link}
                                onChange={(e) => {
                                    form.setData('payment_link', e.target.value);
                                    // Clear error when user starts typing
                                    if (validationErrors.payment_link) {
                                        setValidationErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.payment_link;
                                            return newErrors;
                                        });
                                    }
                                }}
                                disabled={form.processing}
                                placeholder="https://payment-link.com"
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-gold focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed ${
                                    validationErrors.payment_link || form.errors.payment_link
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                }`}
                            />
                            {(validationErrors.payment_link || form.errors.payment_link) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {validationErrors.payment_link || form.errors.payment_link}
                                </p>
                            )}
                        </div>

                        {/* Admin Notes Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Admin Notes (Optional)
                            </label>
                            <textarea
                                value={form.data.admin_notes}
                                onChange={(e) => {
                                    form.setData('admin_notes', e.target.value);
                                    // Clear error when user starts typing
                                    if (validationErrors.admin_notes) {
                                        setValidationErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.admin_notes;
                                            return newErrors;
                                        });
                                    }
                                }}
                                disabled={form.processing}
                                rows="4"
                                maxLength="1000"
                                placeholder="Add any notes for the client..."
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-gold focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed ${
                                    validationErrors.admin_notes || form.errors.admin_notes
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                }`}
                            />
                            <div className="flex justify-between mt-1">
                                <div>
                                    {(validationErrors.admin_notes || form.errors.admin_notes) && (
                                        <p className="text-sm text-red-600">
                                            {validationErrors.admin_notes || form.errors.admin_notes}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {form.data.admin_notes.length}/1000 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex-1 px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                        >
                            {form.processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Submit Quote'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={form.processing}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
