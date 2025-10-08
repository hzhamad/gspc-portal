import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

export default function QuoteRequest() {
    const { props } = usePage();
    const user = props?.auth?.user;
    const emirates = props?.emirates || [
        'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
    ];

    const [applicationType, setApplicationType] = useState('');
    const [dependents, setDependents] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        application_type: '',
        // Principal Details
        sponsor_name: user?.fullname || '',
        sponsor_id: '',
        date_of_birth: '',
        emirate_of_residency: '',
        profile_picture: null,
        eid_copy: null,
        // Dependents
        dependents: [],
    });

    const addDependent = () => {
        const newDependent = {
            id: Date.now(),
            uid_number: '',
            eid_number: '',
            marital_status: '',
            date_of_birth: '',
            relationship: '',
            profile_picture: null,
            eid_copy: null,
        };
        setDependents([...dependents, newDependent]);
    };

    const removeDependent = (id) => {
        setDependents(dependents.filter(dep => dep.id !== id));
    };

    const updateDependent = (id, field, value) => {
        setDependents(dependents.map(dep =>
            dep.id === id ? { ...dep, [field]: value } : dep
        ));
    };

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const handleDependentFileChange = (id, field, file) => {
        setDependents(dependents.map(dep =>
            dep.id === id ? { ...dep, [field]: file } : dep
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('application_type', applicationType);
        
        // Add principal data if applying for self
        if (applicationType === 'self' || applicationType === 'self_dependents') {
            formData.append('sponsor_name', data.sponsor_name);
            formData.append('sponsor_id', data.sponsor_id);
            formData.append('date_of_birth', data.date_of_birth);
            formData.append('emirate_of_residency', data.emirate_of_residency);
            
            if (data.profile_picture) {
                formData.append('profile_picture', data.profile_picture);
            }
            if (data.eid_copy) {
                formData.append('eid_copy', data.eid_copy);
            }
        }
        
        // Add dependents data
        if (applicationType === 'dependents' || applicationType === 'self_dependents') {
            dependents.forEach((dep, index) => {
                formData.append(`dependents[${index}][uid_number]`, dep.uid_number || '');
                formData.append(`dependents[${index}][eid_number]`, dep.eid_number || '');
                formData.append(`dependents[${index}][marital_status]`, dep.marital_status);
                formData.append(`dependents[${index}][date_of_birth]`, dep.date_of_birth);
                formData.append(`dependents[${index}][relationship]`, dep.relationship);
                
                if (dep.profile_picture) {
                    formData.append(`dependents[${index}][profile_picture]`, dep.profile_picture);
                }
                if (dep.eid_copy) {
                    formData.append(`dependents[${index}][eid_copy]`, dep.eid_copy);
                }
            });
        }

        router.post('/quote-request', formData, {
            onSuccess: () => {
                reset();
                setDependents([]);
                setApplicationType('');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar (same as dashboard) */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-10">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
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
                        <a href="/quote-request" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <h1 className="text-3xl font-bold text-gray-800">New Insurance Application</h1>
                        <p className="text-gray-600 mt-1">Apply for health insurance coverage</p>
                    </div>
                </header>

                <main className="p-8">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                        {/* Application Type Selection */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Application Type</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setApplicationType('self')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        applicationType === 'self'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <svg className={`w-12 h-12 mx-auto mb-3 ${applicationType === 'self' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="font-semibold text-gray-800 mb-1">Self Only</h3>
                                    <p className="text-sm text-gray-600">Apply for yourself</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setApplicationType('self_dependents')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        applicationType === 'self_dependents'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <svg className={`w-12 h-12 mx-auto mb-3 ${applicationType === 'self_dependents' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="font-semibold text-gray-800 mb-1">Self + Dependents</h3>
                                    <p className="text-sm text-gray-600">Apply for you and family</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setApplicationType('dependents')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        applicationType === 'dependents'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <svg className={`w-12 h-12 mx-auto mb-3 ${applicationType === 'dependents' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <h3 className="font-semibold text-gray-800 mb-1">Dependents Only</h3>
                                    <p className="text-sm text-gray-600">Apply for family members</p>
                                </button>
                            </div>
                            {errors.application_type && <p className="text-red-600 text-sm mt-2">{errors.application_type}</p>}
                        </div>

                        {/* Principal Details (Self or Self + Dependents) */}
                        {(applicationType === 'self' || applicationType === 'self_dependents') && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Principal Applicant Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Name</label>
                                        <input
                                            type="text"
                                            value={data.sponsor_name}
                                            onChange={(e) => setData('sponsor_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.sponsor_name && <p className="text-red-600 text-sm mt-1">{errors.sponsor_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor ID (784-)</label>
                                        <input
                                            type="text"
                                            value={data.sponsor_id}
                                            onChange={(e) => setData('sponsor_id', e.target.value)}
                                            placeholder="784-XXXX-XXXXXXX-X"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.sponsor_id && <p className="text-red-600 text-sm mt-1">{errors.sponsor_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.date_of_birth && <p className="text-red-600 text-sm mt-1">{errors.date_of_birth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emirate of Residency</label>
                                        <select
                                            value={data.emirate_of_residency}
                                            onChange={(e) => setData('emirate_of_residency', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Emirate</option>
                                            {emirates.map(emirate => (
                                                <option key={emirate} value={emirate}>{emirate}</option>
                                            ))}
                                        </select>
                                        {errors.emirate_of_residency && <p className="text-red-600 text-sm mt-1">{errors.emirate_of_residency}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('profile_picture', e.target.files[0])}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.profile_picture && <p className="text-red-600 text-sm mt-1">{errors.profile_picture}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emirates ID Copy</label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange('eid_copy', e.target.files[0])}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.eid_copy && <p className="text-red-600 text-sm mt-1">{errors.eid_copy}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dependents Section */}
                        {(applicationType === 'dependents' || applicationType === 'self_dependents') && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Dependents</h2>
                                    <button
                                        type="button"
                                        onClick={addDependent}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Dependent
                                    </button>
                                </div>

                                {dependents.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No dependents added yet. Click "Add Dependent" to start.</p>
                                    </div>
                                )}

                                {dependents.map((dependent, index) => (
                                    <div key={dependent.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800">Dependent #{index + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeDependent(dependent.id)}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">UID Number (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={dependent.uid_number}
                                                    onChange={(e) => updateDependent(dependent.id, 'uid_number', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">EID Number (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={dependent.eid_number}
                                                    onChange={(e) => updateDependent(dependent.id, 'eid_number', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                                <select
                                                    value={dependent.marital_status}
                                                    onChange={(e) => updateDependent(dependent.id, 'marital_status', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="single">Single</option>
                                                    <option value="married">Married</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={dependent.date_of_birth}
                                                    onChange={(e) => updateDependent(dependent.id, 'date_of_birth', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Sponsor</label>
                                                <select
                                                    value={dependent.relationship}
                                                    onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Select Relationship</option>
                                                    <option value="spouse">Spouse</option>
                                                    <option value="child">Child</option>
                                                    <option value="parent">Parent</option>
                                                    <option value="sibling">Sibling</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleDependentFileChange(dependent.id, 'profile_picture', e.target.files[0])}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Emirates ID Copy</label>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleDependentFileChange(dependent.id, 'eid_copy', e.target.files[0])}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        {applicationType && (
                            <div className="flex items-center justify-between">
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
                                    {processing ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}
