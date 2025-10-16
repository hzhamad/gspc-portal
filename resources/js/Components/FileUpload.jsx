import React, { useState, useEffect } from 'react';

export default function FileUpload({ 
    label, 
    accept = "image/*,.pdf", 
    onChange, 
    fileName = null,
    placeholder = "Click to upload PNG/JPG/PDF",
    error = null,
    required = false,
    maxSize = 50, // MB (changed from 10)
    fileType = 'document', // 'image' or 'document'
    currentFileUrl = null,
    currentFileName = null
}) {
    const [validationError, setValidationError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentFileUrl);
    const [selectedFile, setSelectedFile] = useState(null);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const validateFile = (file) => {
        if (!file) return null;

        const errors = [];

        // File size validation
        const maxBytes = (fileType === 'image' ? 50 : 50) * 1024 * 1024; // 50 MB
        if (file.size > maxBytes) {
            errors.push(`File size must not exceed ${fileType === 'image' ? 50 : 50} MB`);
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
            setSelectedFile(null);
            setPreviewUrl(currentFileUrl);
            onChange(e);
            return;
        }

        const error = validateFile(file);
        if (error) {
            setValidationError(error);
            e.target.value = ''; // Clear the input
            return;
        }

        setSelectedFile(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            // Revoke old object URL if it exists
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }

        onChange(e);
    };

    const isImage = (url) => {
        if (!url) return false;
        return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || (selectedFile && selectedFile.type.startsWith('image/'));
    };

    const isPDF = (url) => {
        if (!url) return false;
        return url.match(/\.pdf$/i) || (selectedFile && selectedFile.type === 'application/pdf');
    };

    const getFileIcon = () => {
        if (isPDF(previewUrl || currentFileUrl)) {
            return (
                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H11V9H18V20H6Z" />
                </svg>
            );
        }
        return (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        );
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Area */}
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
                                <p className="text-sm text-gray-700 font-medium truncate px-2">{fileName}</p>
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

                {/* Preview Area */}
                {(previewUrl || currentFileUrl) && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col items-center justify-center h-full">
                            {isImage(previewUrl || currentFileUrl) ? (
                                <div className="w-full">
                                    <img 
                                        src={previewUrl || currentFileUrl} 
                                        alt="Preview" 
                                        className="w-full h-32 object-contain rounded-lg"
                                    />
                                    <p className="text-xs text-center text-gray-600 mt-2">
                                        {selectedFile ? 'New file selected' : 'Current file'}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    {getFileIcon()}
                                    <p className="text-sm text-gray-700 font-medium mt-2">
                                        {selectedFile ? selectedFile.name : (currentFileName || 'Document')}
                                    </p>
                                    {currentFileUrl && !selectedFile && (
                                        <a 
                                            href={currentFileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center mt-2 text-xs text-gold hover:brightness-110 font-medium"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View File
                                        </a>
                                    )}
                                    {selectedFile && (
                                        <p className="text-xs text-green-600 mt-2">
                                            ✓ Ready to upload
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {(error || validationError) && (
                <p className="mt-2 text-sm text-red-600">{error || validationError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
                Max size: {fileType === 'image' ? '50' : '50'}MB. Allowed: PDF, DOC, DOCX, JPG, PNG
            </p>
        </div>
    );
}