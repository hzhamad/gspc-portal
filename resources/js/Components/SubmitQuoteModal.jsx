import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';

export default function SubmitQuoteModal({ isOpen, onClose, requestId }) {
    const form = useForm({
        quote_files: [],
        payment_link: '',
        admin_notes: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [quoteFiles, setQuoteFiles] = useState([{ file: null }]);

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
            setValidationErrors({});
            setQuoteFiles([{ file: null }]);
        }
    }, [isOpen]);

    const validateForm = () => {
        const errors = {};

        // Validate quote files (at least one)
        const files = quoteFiles.map(q => q.file).filter(f => f !== null);
        if (files.length === 0) {
            errors.quote_files = 'At least one quote file is required';
        } else {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 50 * 1024 * 1024; // 50MB (match policy files)
            files.forEach((file, idx) => {
                if (!file) return;
                if (!validTypes.includes(file.type)) {
                    errors[`quote_files.${idx}`] = 'File must be PDF, DOC, or DOCX format';
                } else if (file.size > maxSize) {
                    errors[`quote_files.${idx}`] = 'File size must not exceed 50MB';
                }
            });
        }

        // No premium file anymore; quote_files replaces quote & premium

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

    const addQuoteFile = () => {
        setQuoteFiles([...quoteFiles, { file: null }]);
    };

    const removeQuoteFile = (index) => {
        const newFiles = quoteFiles.filter((_, i) => i !== index);
        setQuoteFiles(newFiles.length > 0 ? newFiles : [{ file: null }]);
    };

    const updateQuoteFile = (index, file) => {
        const newFiles = [...quoteFiles];
        newFiles[index] = { file };
        setQuoteFiles(newFiles);

        // Clear per-file validation error if present
        if (validationErrors[`quote_files.${index}`] || validationErrors.quote_files) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`quote_files.${index}`];
                delete newErrors.quote_files;
                return newErrors;
            });
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

        const files = quoteFiles.map(q => q.file).filter(f => f !== null);

        // Transform form to include files array
        form.transform((data) => ({
            ...data,
            quote_files: files,
        }));

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
        setQuoteFiles([{ file: null }]);
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
                        {/* Quote Files Input (multiple) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quote Files <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {quoteFiles.map((qf, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => updateQuoteFile(index, e.target.files[0])}
                                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-gold"
                                        />
                                        {quoteFiles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuoteFile(index)}
                                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {(validationErrors.quote_files || form.errors.quote_files) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {validationErrors.quote_files || form.errors.quote_files}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 50MB each)</p>

                            {quoteFiles.length < 10 && (
                                <button
                                    type="button"
                                    onClick={addQuoteFile}
                                    className="mt-3 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Another File
                                </button>
                            )}
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
