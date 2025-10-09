import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function AdminDashboard() {
    const { props } = usePage();
    const user = props?.auth?.user;
    const stats = props?.stats || {
        total_users: 0,
        active_users: 0,
        total_quote_requests: 0,
        pending_requests: 0,
        completed_requests: 0,
        active_policies: 0,
    };
    const recentUsers = props?.recentUsers || [];
    const recentRequests = props?.recentRequests || [];

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
            quote_sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Quote Sent" },
            payment_pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Payment Pending" },
            completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getUserStatusBadge = (status) => {
        return status ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactive
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/admin/dashboard" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title={`Welcome back, ${user?.fullname || user?.name}!`}
                    subtitle="Manage users, applications and policies"
                />

                {/* Dashboard Content */}
                <main className="p-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-gold to-gold/80 rounded-2xl shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">User Management</h2>
                                    <p className="text-white/90 mb-4">View and manage all registered users</p>
                                    <button
                                        onClick={() => router.visit('/admin/users')}
                                        className="inline-flex items-center px-6 py-3 bg-white text-gold font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Manage Users
                                    </button>
                                </div>
                                <div className="hidden md:block">
                                    <svg className="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Quote Requests</h2>
                                    <p className="text-white/90 mb-4">Review pending insurance applications</p>
                                    <button
                                        onClick={() => router.visit('/admin/quote-requests')}
                                        className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Requests
                                    </button>
                                </div>
                                <div className="hidden md:block">
                                    <svg className="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.total_users}</p>
                            <p className="text-sm text-green-600 mt-2">{stats.active_users} active</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Quote Requests</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.total_quote_requests}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Pending Review</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending_requests}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.completed_requests}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Active Policies</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.active_policies}</p>
                        </div>
                    </div>

                    {/* Two Column Layout for Recent Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Users */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
                                    <button
                                        onClick={() => router.visit('/admin/users')}
                                        className="text-gold hover:brightness-110 font-medium text-sm transition-all"
                                    >
                                        View All →
                                    </button>
                                </div>
                            </div>
                            
                            {recentUsers.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {recentUsers.map((recentUser) => (
                                        <div key={recentUser.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {recentUser.first_name?.charAt(0)}{recentUser.last_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{recentUser.fullname}</p>
                                                        <p className="text-sm text-gray-500">{recentUser.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getUserStatusBadge(recentUser.status)}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(recentUser.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-gray-500">No users yet</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Requests */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">Recent Requests</h2>
                                    <button
                                        onClick={() => router.visit('/admin/quote-requests')}
                                        className="text-gold hover:brightness-110 font-medium text-sm transition-all"
                                    >
                                        View All →
                                    </button>
                                </div>
                            </div>
                            
                            {recentRequests.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {recentRequests.map((request) => (
                                        <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-800">#{request.id}</h3>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {request.user?.fullname || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(request.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500">No requests yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
