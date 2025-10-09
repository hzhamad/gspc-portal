import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function RequestDetail() {
    const { props } = usePage();
    const request = props?.request || {};
    const dependents = request?.dependents || [];

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            quote_sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Quote Sent", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            payment_pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Payment Pending", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
            completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                </svg>
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

    const getMaritalStatusLabel = (status) => {
        return status === 'single' ? 'Single' : 'Married';
    };

    const getDependentFullName = (dependent) => {
        const parts = [dependent.first_name, dependent.middle_name, dependent.last_name]
            .filter((part) => part && part.trim());
        return parts.length ? parts.join(' ') : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/my-requests" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title={`Application #${request.id}`}
                    subtitle="View and manage your insurance application details"
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit('/my-requests')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Applications
                        </button>
                    </div>

                    {/* Quote Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Quote Details</h3>
                        </div>

                        {/* Application Status */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-800">Application Status</h4>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Submitted on {formatDateTime(request.created_at)}
                                    </p>
                                    {request.updated_at && request.updated_at !== request.created_at && (
                                        <p className="text-xs text-gray-500">
                                            Last updated: {formatDateTime(request.updated_at)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Quote File */}
                            {request.quote_file && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Insurance Quote</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Your personalized insurance quote is ready for review.</p>
                                    <a
                                        href={`/storage/${request.quote_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Quote
                                    </a>
                                </div>
                            )}

                            {/* Policy Files */}
                            {request.policy_file && Array.isArray(request.policy_file) && request.policy_file.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Policy Documents</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Your insurance policy documents are ready.</p>
                                    <div className="space-y-2">
                                        {request.policy_file.map((file, index) => (
                                            <a
                                                key={index}
                                                href={`/storage/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-between px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all text-sm"
                                            >
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Policy Document {request.policy_file.length > 1 ? `${index + 1}` : ''}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Link */}
                            {request.payment_link && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Payment</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Complete your payment to activate your insurance policy.</p>
                                    <a
                                        href={request.payment_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all text-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Proceed to Payment
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Application Type Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Application Type</p>
                                <p className="text-lg font-semibold text-gray-800">{getApplicationTypeLabel(request.application_type)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Application ID</p>
                                <p className="text-lg font-semibold text-gray-800">#{request.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Principal/Sponsor Information */}
                    {(request.application_type === 'self' || request.application_type === 'self_dependents') && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Principal Information</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Sponsor Name</label>
                                        <p className="text-base font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                                            {request.sponsor_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Sponsor ID</label>
                                        <p className="text-base font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                                            {request.sponsor_id || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Date of Birth</label>
                                        <p className="text-base font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                                            {formatDate(request.dob)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Emirate of Residency</label>
                                        <p className="text-base font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                                            {request.emirate_of_residency || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">Profile Picture</label>
                                        {request.profile_picture ? (
                                            <div className="relative group">
                                                <img 
                                                    src={`/storage/${request.profile_picture}`} 
                                                    alt="Profile" 
                                                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <a
                                                    href={`/storage/${request.profile_picture}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                                                >
                                                    <span className="text-white font-medium flex items-center">
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View Full Size
                                                    </span>
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center text-gray-400">
                                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm">No image uploaded</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">Emirates ID Copy</label>
                                        {request.eid_file ? (
                                            <a
                                                href={`/storage/${request.eid_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Emirates ID Document</p>
                                                        <p className="text-sm text-gray-600">Click to view</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-400">
                                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm">No document uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dependents Information */}
                    {(request.application_type === 'dependents' || request.application_type === 'self_dependents') && dependents.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dependents ({dependents.length})</h3>
                            </div>

                            <div className="space-y-6">
                                {dependents.map((dependent, index) => (
                                    <div key={dependent.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-bold text-gray-800">Dependent #{index + 1}</h4>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                                                {getRelationshipLabel(dependent.relationship)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Basic Info */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
                                                    <p className="text-base font-semibold text-gray-800 p-3 bg-white rounded-lg border border-gray-200">
                                                        {getDependentFullName(dependent)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-1">UID Number</label>
                                                    <p className="text-base font-semibold text-gray-800 p-3 bg-white rounded-lg border border-gray-200">
                                                        {dependent.uid_number || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-1">Emirates ID Number</label>
                                                    <p className="text-base font-semibold text-gray-800 p-3 bg-white rounded-lg border border-gray-200">
                                                        {dependent.eid_number || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-1">Date of Birth</label>
                                                    <p className="text-base font-semibold text-gray-800 p-3 bg-white rounded-lg border border-gray-200">
                                                        {formatDate(dependent.dob)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-1">Marital Status</label>
                                                    <p className="text-base font-semibold text-gray-800 p-3 bg-white rounded-lg border border-gray-200">
                                                        {getMaritalStatusLabel(dependent.marital_status)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Documents */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-2">Profile Picture</label>
                                                    {dependent.profile_picture ? (
                                                        <div className="relative group">
                                                            <img 
                                                                src={`/storage/${dependent.profile_picture}`} 
                                                                alt={`Dependent ${index + 1}`}
                                                                className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                                                            />
                                                            <a
                                                                href={`/storage/${dependent.profile_picture}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                                                            >
                                                                <span className="text-white font-medium flex items-center">
                                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    View
                                                                </span>
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-40 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                                            <div className="text-center text-gray-400">
                                                                <svg className="w-10 h-10 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <p className="text-xs">No image</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 block mb-2">Emirates ID Copy</label>
                                                    {dependent.eid_file ? (
                                                        <a
                                                            href={`/storage/${dependent.eid_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-sm">EID Document</p>
                                                                    <p className="text-xs text-gray-600">Click to view</p>
                                                                </div>
                                                            </div>
                                                            <svg className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </a>
                                                    ) : (
                                                        <div className="p-3 bg-white rounded-lg border-2 border-gray-200 text-center text-gray-400">
                                                            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-xs">No document</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admin Notes */}
                    {request.admin_notes && Array.isArray(request.admin_notes) && request.admin_notes.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Notes from Admin</h3>
                            </div>
                            <div className="space-y-3">
                                {request.admin_notes.map((noteItem, index) => (
                                    <div key={index} className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                                                {noteItem.action || 'Note'}
                                            </span>
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
                </main>
            </div>
        </div>
    );
}
