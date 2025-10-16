import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function MyRequests() {
    const { props } = usePage();
    const user = props?.auth?.user;
    const requests = props?.requests?.data || [];
    const pagination = props?.requests || {};

    const [filterStatus, setFilterStatus] = useState('all');

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            quote_sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Quote Sent", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                </svg>
                {config.label}
            </span>
        );
    };

    const filteredRequests = filterStatus === 'all' 
        ? requests 
        : requests.filter(req => req.status === filterStatus);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/my-requests" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title="My Applications"
                    subtitle="Track and manage your insurance applications"
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Filter Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                    filterStatus === 'all' ? 'bg-gold text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                All Applications
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                    filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilterStatus('quote_sent')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                    filterStatus === 'quote_sent' ? 'bg-gold text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Quote Sent
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                    filterStatus === 'completed' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Requests List */}
                    {filteredRequests.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">Application #{request.id}</h3>
                                                    {getStatusBadge(request.status)}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Type:</span> {request.application_type?.replace('_', ' + ')}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Submitted:</span> {new Date(request.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.visit(`/my-requests/${request.id}`)}
                                                className="ml-4 px-6 py-2 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all"
                                            >
                                                View Details
                                            </button>
                                        </div>

                                        {/* Additional Info Based on Status */}
                                        {request.quote_file && request.status !== 'completed' && (
                                            <div className="mt-4 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">Quote Available</p>
                                                            <p className="text-sm text-gray-600">Your insurance quote is ready</p>
                                                        </div>
                                                    </div>
                                                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                                    <a
                                                                        href={request.quote_file}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-full sm:w-auto px-4 py-2 bg-white border border-gold text-gold font-medium rounded-lg hover:bg-gold/10 transition-all text-center"
                                                                    >
                                                                        Download Quote
                                                                    </a>
                                                                    {request.premium_file && (
                                                                        <a
                                                                            href={request.premium_file}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="w-full sm:w-auto px-4 py-2 bg-white border border-indigo-200 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all text-center"
                                                                        >
                                                                            Download Premium
                                                                        </a>
                                                                    )}
                                                                    {request.status === 'quote_sent' && request.payment_link && (
                                                                        <a
                                                                            href={request.payment_link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="w-full sm:w-auto px-4 py-2 bg-gold text-white font-medium rounded-lg hover:brightness-110 transition-all text-center inline-flex items-center justify-center gap-2"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                            </svg>
                                                                            Proceed to Payment
                                                                        </a>
                                                                    )}
                                                                </div>
                                                </div>
                                            </div>
                                        )}

                                        {request.policy_file && (
                                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">Policy Document</p>
                                                            <p className="text-sm text-gray-600">Your insurance policy is ready</p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={request.policy_file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Download Policy
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications found</h3>
                            <p className="text-gray-600 mb-6">
                                {filterStatus === 'all' 
                                    ? "You haven't submitted any insurance applications yet." 
                                    : `No ${filterStatus.replace('_', ' ')} applications found.`}
                            </p>
                            <button
                                onClick={() => router.visit('/quote-request#application-type')}
                                className="inline-flex items-center px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Application
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{pagination.from}</span> to{" "}
                                <span className="font-medium">{pagination.to}</span> of{" "}
                                <span className="font-medium">{pagination.total}</span> results
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {pagination.links?.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                            link.active
                                                ? "bg-gold text-white"
                                                : link.url
                                                ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
