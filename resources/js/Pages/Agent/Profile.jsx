import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";

export default function Profile() {
    const { props } = usePage();
    const user = props?.auth?.user;

    const { data, setData, put, processing, errors } = useForm({
        first_name: user?.first_name || '',
        middle_name: user?.middle_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/profile');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-10">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <img 
                                src="/images/uae_logo.svg" 
                                alt="UAE Logo" 
                                className="w-6 h-6"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">GSPC Portal</h2>
                            <p className="text-xs text-gray-500">Client Dashboard</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Dashboard</span>
                        </a>
                        <a href="/quote-request" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Application</span>
                        </a>
                        <a href="/my-requests" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>My Requests</span>
                        </a>
                        <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile</span>
                        </a>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64 min-h-screen">
                <header className="bg-white border-b border-gray-200">
                    <div className="px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your personal information</p>
                    </div>
                </header>

                <main className="p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Profile Avatar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                                    {user?.fullname?.charAt(0) || user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{user?.fullname || user?.name}</h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        {user?.roles?.map((role, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {role === 'agent' ? 'Client' : role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                    <input
                                        type="text"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.middle_name && <p className="text-red-600 text-sm mt-1">{errors.middle_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/dashboard')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
