import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';
import FileUpload from '@/Components/FileUpload';

export default function Profile() {
    const { props } = usePage();
    const user = props?.auth?.user;

    const { data, setData, post, processing, errors } = useForm({
        first_name: user?.first_name || '',
        middle_name: user?.middle_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        eid_number: user?.eid_number || '',
        eid_file: null,
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/profile" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title="My Profile"
                    subtitle="Manage your personal information"
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Profile Avatar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center text-white font-bold text-3xl shrink-0">
                                    {user?.fullname?.charAt(0) || user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{user?.fullname || user?.name}</h2>
                                    <p className="text-gray-600 mt-1">{user?.email}</p>
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                        {user?.roles?.map((role, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20">
                                                {role === 'agent' ? 'Client' : role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Personal Information</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                    />
                                    {errors.middle_name && <p className="text-red-600 text-sm mt-1">{errors.middle_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                        required
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                        placeholder="+971XXXXXXXXX"
                                    />
                                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Emirates ID Section */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emirates ID Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emirates ID Number</label>
                                        <input
                                            type="text"
                                            value={data.eid_number}
                                            onChange={(e) => setData('eid_number', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="784-XXXX-XXXXXXX-X"
                                        />
                                        {errors.eid_number && <p className="text-red-600 text-sm mt-1">{errors.eid_number}</p>}
                                    </div>

                                    <div>
                                        <FileUpload
                                            label="Emirates ID Copy"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setData('eid_file', e.target.files[0])}
                                            fileName={data.eid_file?.name}
                                            placeholder={user?.eid_file ? "Replace current EID file" : "Upload EID copy (PNG/JPG/PDF)"}
                                            error={errors.eid_file}
                                        />
                                        {user?.eid_file && !data.eid_file && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <a 
                                                    href={`/storage/${user.eid_file}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-gold hover:brightness-110 font-medium"
                                                >
                                                    View current EID file
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/dashboard')}
                                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-8 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
