import React, { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function QuoteRequestShow() {
    const { props } = usePage();
    const request = props?.request || {};
    const dependents = request?.dependents || [];

    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);

    const quoteForm = useForm({
        quote_file: null,
        payment_link: '',
        admin_notes: '',
    });

    const [policyFiles, setPolicyFiles] = useState([{ file: null }]);
    const policyForm = useForm({
        policy_files: [],
        admin_notes: '',
    });

    const handleSubmitQuote = (e) => {
        e.preventDefault();
        quoteForm.post(`/admin/quote-requests/${request.id}/upload-quote`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowQuoteModal(false);
                quoteForm.reset();
            },
        });
    };

    const handleSubmitPolicy = (e) => {
        e.preventDefault();
        const files = policyFiles.map(pf => pf.file).filter(f => f !== null);
        
        // Update the form data with the files
        policyForm.transform((data) => ({
            ...data,
            policy_files: files,
        }));

        policyForm.post(`/admin/quote-requests/${request.id}/upload-policy`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowPolicyModal(false);
                policyForm.reset();
                setPolicyFiles([{ file: null }]);
            },
        });
    };

    const addPolicyFile = () => {
        setPolicyFiles([...policyFiles, { file: null }]);
    };

    const removePolicyFile = (index) => {
        const newFiles = policyFiles.filter((_, i) => i !== index);
        setPolicyFiles(newFiles.length > 0 ? newFiles : [{ file: null }]);
    };

    const updatePolicyFile = (index, file) => {
        const newFiles = [...policyFiles];
        newFiles[index] = { file };
        setPolicyFiles(newFiles);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review" },
            quote_sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Quote Sent" },
            payment_pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Payment Pending" },
            completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getApplicationTypeLabel = (type) => {
        const labels = {
            'self': 'Self Only',
            'self_dependents': 'Self + Dependents',
            'dependents': 'Dependents Only'
        };
        return labels[type] || type;
    };

    const getRelationshipLabel = (relationship) => {
        const labels = {
            'spouse': 'Spouse',
            'child': 'Child',
            'parent': 'Parent',
            'sibling': 'Sibling'
        };
        return labels[relationship] || relationship;
    };

    const getDependentFullName = (dependent) => {
        const parts = [dependent.first_name, dependent.middle_name, dependent.last_name]
            .filter((part) => part && part.trim());
        return parts.length ? parts.join(' ') : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardAside currentPath="/admin/quote-requests" />

            <div className="lg:ml-64 min-h-screen">
                <DashboardHeader 
                    title={`Quote Request #${request.id}`}
                    subtitle="View and manage quote request details"
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit('/admin/quote-requests')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Quote Requests
                        </button>
                    </div>

                    {/* Status and Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-800">Request Status</h2>
                                    {getStatusBadge(request.status)}
                                </div>
                                <p className="text-gray-600">
                                    Submitted on {formatDateTime(request.created_at)}
                                </p>
                                {request.updated_at && request.updated_at !== request.created_at && (
                                    <p className="text-sm text-gray-500">
                                        Last updated: {formatDateTime(request.updated_at)}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                {request.status !== 'quote_sent' && request.status !== 'completed' && (
                                    <button
                                        onClick={() => setShowQuoteModal(true)}
                                        className="px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all inline-flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Submit Quote
                                    </button>
                                )}
                                {request.status !== 'pending' && request.status !== 'completed' && (
                                    <button
                                        onClick={() => setShowPolicyModal(true)}
                                        className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all inline-flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Submit Policy
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Client Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Client Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                <p className="text-base text-gray-900 mt-1">{request.user?.fullname || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-base text-gray-900 mt-1">{request.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                <p className="text-base text-gray-900 mt-1">{request.user?.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nationality</label>
                                <p className="text-base text-gray-900 mt-1">{request.user?.nationality || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Application Type</label>
                                <p className="text-base text-gray-900 mt-1">{getApplicationTypeLabel(request.application_type)}</p>
                            </div>
                            {request.sponsor_name && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Sponsor Name</label>
                                        <p className="text-base text-gray-900 mt-1">{request.sponsor_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Sponsor ID</label>
                                        <p className="text-base text-gray-900 mt-1">{request.sponsor_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                        <p className="text-base text-gray-900 mt-1">{formatDate(request.dob)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Emirate of Residency</label>
                                        <p className="text-base text-gray-900 mt-1">{request.emirate_of_residency || 'N/A'}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Files */}
                        {(request.profile_picture || request.eid_file) && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Documents</h4>
                                <div className="flex flex-wrap gap-3">
                                    {request.profile_picture && (
                                        <a
                                            href={`/storage/${request.profile_picture}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Profile Picture
                                        </a>
                                    )}
                                    {request.eid_file && (
                                        <a
                                            href={`/storage/${request.eid_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Emirates ID
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dependents */}
                    {dependents.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dependents ({dependents.length})</h3>
                            </div>

                            <div className="space-y-4">
                                {dependents.map((dependent, index) => (
                                    <div key={dependent.id} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3">Dependent {index + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                                <p className="text-base text-gray-900 mt-1">{getDependentFullName(dependent)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Relationship</label>
                                                <p className="text-base text-gray-900 mt-1">{getRelationshipLabel(dependent.relationship)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                                <p className="text-base text-gray-900 mt-1">{formatDate(dependent.dob)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Marital Status</label>
                                                <p className="text-base text-gray-900 mt-1">{dependent.marital_status === 'single' ? 'Single' : 'Married'}</p>
                                            </div>
                                            {dependent.uid_number && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">UID Number</label>
                                                    <p className="text-base text-gray-900 mt-1">{dependent.uid_number}</p>
                                                </div>
                                            )}
                                            {dependent.eid_number && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">EID Number</label>
                                                    <p className="text-base text-gray-900 mt-1">{dependent.eid_number}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Dependent Files */}
                                        {(dependent.profile_picture || dependent.eid_file) && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Documents</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {dependent.profile_picture && (
                                                        <a
                                                            href={`/storage/${dependent.profile_picture}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Profile
                                                        </a>
                                                    )}
                                                    {dependent.eid_file && (
                                                        <a
                                                            href={`/storage/${dependent.eid_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            EID
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admin Notes */}
                    {request.admin_notes && Array.isArray(request.admin_notes) && request.admin_notes.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Notes from Admin</h3>
                            </div>
                            <div className="space-y-4">
                                {request.admin_notes.map((noteItem, index) => (
                                    <div key={index} className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                                                    {noteItem.action || 'Note'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-amber-700">
                                                {new Date(noteItem.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-amber-900 whitespace-pre-wrap">{noteItem.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quote and Policy Files */}
                    {(request.quote_file || request.policy_file) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Submitted Documents</h3>
                            </div>
                            <div className="space-y-3">
                                {request.quote_file && (
                                    <a
                                        href={`/storage/${request.quote_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-blue-900">Quote Document</p>
                                                    <p className="text-sm text-blue-700">Click to download</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </a>
                                )}
                                {request.policy_file && Array.isArray(request.policy_file) && request.policy_file.map((file, index) => (
                                    <a
                                        key={index}
                                        href={`/storage/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-green-900">Policy Document {index + 1}</p>
                                                    <p className="text-sm text-green-700">Click to download</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                                {request.payment_link && (
                                    <a
                                        href={request.payment_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-purple-900">Payment Link</p>
                                                    <p className="text-sm text-purple-700">Click to proceed with payment</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Submit Quote Modal */}
            {showQuoteModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Submit Quote</h2>
                                <button
                                    onClick={() => setShowQuoteModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitQuote} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Quote File <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => quoteForm.setData('quote_file', e.target.files[0])}
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-gold"
                                    />
                                    {quoteForm.errors.quote_file && (
                                        <p className="mt-1 text-sm text-red-600">{quoteForm.errors.quote_file}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Payment Link (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={quoteForm.data.payment_link}
                                        onChange={(e) => quoteForm.setData('payment_link', e.target.value)}
                                        placeholder="https://payment-link.com"
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold"
                                    />
                                    {quoteForm.errors.payment_link && (
                                        <p className="mt-1 text-sm text-red-600">{quoteForm.errors.payment_link}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Admin Notes (Optional)
                                    </label>
                                    <textarea
                                        value={quoteForm.data.admin_notes}
                                        onChange={(e) => quoteForm.setData('admin_notes', e.target.value)}
                                        rows="4"
                                        placeholder="Add any notes for the client..."
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold"
                                    />
                                    {quoteForm.errors.admin_notes && (
                                        <p className="mt-1 text-sm text-red-600">{quoteForm.errors.admin_notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={quoteForm.processing}
                                    className="flex-1 px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {quoteForm.processing ? 'Uploading...' : 'Submit Quote'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowQuoteModal(false)}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submit Policy Modal */}
            {showPolicyModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Submit Policy Files</h2>
                                <button
                                    onClick={() => setShowPolicyModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitPolicy} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Policy Files <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-3">
                                        {policyFiles.map((policyFile, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => updatePolicyFile(index, e.target.files[0])}
                                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-gold"
                                                />
                                                {policyFiles.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePolicyFile(index)}
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
                                    {policyForm.errors.policy_files && (
                                        <p className="mt-1 text-sm text-red-600">{policyForm.errors.policy_files}</p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 10MB each)</p>
                                    
                                    {policyFiles.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={addPolicyFile}
                                            className="mt-3 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Another File
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Admin Notes (Optional)
                                    </label>
                                    <textarea
                                        value={policyForm.data.admin_notes}
                                        onChange={(e) => policyForm.setData('admin_notes', e.target.value)}
                                        rows="4"
                                        placeholder="Add any notes for the client..."
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold"
                                    />
                                    {policyForm.errors.admin_notes && (
                                        <p className="mt-1 text-sm text-red-600">{policyForm.errors.admin_notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={policyForm.processing}
                                    className="flex-1 px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {policyForm.processing ? 'Uploading...' : 'Submit Policy'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPolicyModal(false)}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
