import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import FileUpload from '@/Components/FileUpload';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

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
        // Dependents
        dependents: [],
    });

    // Validate Sponsor Emirates ID
    const validateSponsorId = (value) => {
        // Emirates ID: 784-YYYY-XXXXXXX-X (15 digits with dashes)
        const eidPattern = /^784-\d{4}-\d{7}-\d{1}$/;
        return eidPattern.test(value);
    };

    const addDependent = () => {
        const newDependent = {
            id: Date.now(),
            uid_number: '',
            eid_number: '',
            marital_status: '',
            date_of_birth: '',
            relationship: '',
            emirate_of_residency: '',
            eid_copy: null,
            uid_loading: false,
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

    // Fetch dependent data from Unified ID
    const fetchUnifiedIdData = async (dependentId, uidNumber) => {
        if (!uidNumber || uidNumber.length < 10) {
            alert('Please enter a valid Unified ID number');
            return;
        }

        // Set loading state
        updateDependent(dependentId, 'uid_loading', true);

        try {
            // Simulate API call to fetch Unified ID data
            // In production, replace this with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock data response - replace with actual API response
            const mockData = {
                eid_number: '784-2020-1234567-1',
                date_of_birth: '1995-06-15',
                emirate_of_residency: 'Dubai',
            };

            // Update dependent with fetched data
            setDependents(dependents.map(dep => {
                if (dep.id === dependentId) {
                    return {
                        ...dep,
                        eid_number: mockData.eid_number,
                        date_of_birth: mockData.date_of_birth,
                        emirate_of_residency: mockData.emirate_of_residency,
                        uid_loading: false,
                    };
                }
                return dep;
            }));

            alert('Unified ID data loaded successfully');
        } catch (error) {
            alert('Failed to fetch Unified ID data. Please try again.');
            updateDependent(dependentId, 'uid_loading', false);
        }
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

        // Validate Sponsor Emirates ID if applicable
        if ((applicationType === 'self' || applicationType === 'self_dependents') && !validateSponsorId(data.sponsor_id)) {
            alert('Invalid Emirates ID format');
            return;
        }
        
        const formData = new FormData();
        formData.append('application_type', applicationType);
        
        // Add principal data if applying for self
        if (applicationType === 'self' || applicationType === 'self_dependents') {
            formData.append('sponsor_name', data.sponsor_name);
            formData.append('sponsor_id', data.sponsor_id);
            formData.append('date_of_birth', data.date_of_birth);
            formData.append('emirate_of_residency', data.emirate_of_residency);
        }
        
        // Add dependents data
        if (applicationType === 'dependents' || applicationType === 'self_dependents') {
            dependents.forEach((dep, index) => {
                formData.append(`dependents[${index}][uid_number]`, dep.uid_number || '');
                formData.append(`dependents[${index}][eid_number]`, dep.eid_number || '');
                formData.append(`dependents[${index}][marital_status]`, dep.marital_status);
                formData.append(`dependents[${index}][date_of_birth]`, dep.date_of_birth);
                formData.append(`dependents[${index}][relationship]`, dep.relationship);
                formData.append(`dependents[${index}][emirate_of_residency]`, dep.emirate_of_residency || '');
                
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
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/quote-request" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title="New Insurance Application"
                    subtitle="Apply for health insurance coverage"
                />

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
                                            ? 'border-gold bg-gold/10'
                                            : 'border-gray-200 hover:border-gold/50'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                            applicationType === 'self' ? 'bg-gold/20' : 'bg-gray-100'
                                        }`}>
                                            <svg className={`w-6 h-6 ${applicationType === 'self' ? 'text-gold' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Self Only</h3>
                                        <p className="text-sm text-gray-600">Apply for yourself</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setApplicationType('self_dependents')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        applicationType === 'self_dependents'
                                            ? 'border-gold bg-gold/10'
                                            : 'border-gray-200 hover:border-gold/50'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                            applicationType === 'self_dependents' ? 'bg-gold/20' : 'bg-gray-100'
                                        }`}>
                                            <svg className={`w-6 h-6 ${applicationType === 'self_dependents' ? 'text-gold' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Self + Dependents</h3>
                                        <p className="text-sm text-gray-600">Apply for you and family</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setApplicationType('dependents')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        applicationType === 'dependents'
                                            ? 'border-gold bg-gold/10'
                                            : 'border-gray-200 hover:border-gold/50'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                            applicationType === 'dependents' ? 'bg-gold/20' : 'bg-gray-100'
                                        }`}>
                                            <svg className={`w-6 h-6 ${applicationType === 'dependents' ? 'text-gold' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Dependents Only</h3>
                                        <p className="text-sm text-gray-600">Apply for family members</p>
                                    </div>
                                </button>
                            </div>
                            {errors.application_type && <p className="text-red-600 text-sm mt-2">{errors.application_type}</p>}
                        </div>

                        {/* Principal Details */}
                        {(applicationType === 'self' || applicationType === 'self_dependents') && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Sponsor Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Name</label>
                                        <input
                                            type="text"
                                            value={data.sponsor_name}
                                            onChange={(e) => setData('sponsor_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            required
                                        />
                                        {errors.sponsor_name && <p className="text-red-600 text-sm mt-1">{errors.sponsor_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emirates ID</label>
                                        <input
                                            type="text"
                                            value={data.sponsor_id}
                                            onChange={(e) => setData('sponsor_id', e.target.value)}
                                            placeholder="784-YYYY-XXXXXXX-X"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Format: 784-YYYY-XXXXXXX-X</p>
                                        {errors.sponsor_id && <p className="text-red-600 text-sm mt-1">{errors.sponsor_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            required
                                        />
                                        {errors.date_of_birth && <p className="text-red-600 text-sm mt-1">{errors.date_of_birth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emirate of Residency</label>
                                        <select
                                            value={data.emirate_of_residency}
                                            onChange={(e) => setData('emirate_of_residency', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            required
                                        >
                                            <option value="">Select Emirate</option>
                                            {emirates.map(emirate => (
                                                <option key={emirate} value={emirate}>{emirate}</option>
                                            ))}
                                        </select>
                                        {errors.emirate_of_residency && <p className="text-red-600 text-sm mt-1">{errors.emirate_of_residency}</p>}
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Your profile picture and Emirates ID will be used from your profile. 
                                        Please ensure they are up to date in your <a href="/profile" className="text-gold hover:brightness-110 font-semibold">Profile Settings</a>.
                                    </p>
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
                                        className="inline-flex items-center px-4 py-2 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all"
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
                                    <div key={dependent.id} className="border-2 border-gray-200 rounded-lg p-6 mb-4 hover:border-gold/30 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800">Dependent #{index + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeDependent(dependent.id)}
                                                className="text-red-600 hover:text-red-700 font-medium transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        
                                        {/* Unified ID Section */}
                                        <div className="mb-4 p-4 bg-gradient-to-r from-gold/5 to-gold/10 border border-gold/20 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unified ID Number (Auto-fill)
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={dependent.uid_number}
                                                    onChange={(e) => updateDependent(dependent.id, 'uid_number', e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                                    placeholder="Enter UID to auto-fill details"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fetchUnifiedIdData(dependent.id, dependent.uid_number)}
                                                    disabled={dependent.uid_loading || !dependent.uid_number}
                                                    className="px-6 py-2 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    {dependent.uid_loading ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            Load Data
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Enter Unified ID and click "Load Data" to automatically fill Emirates ID, Date of Birth, and Emirate
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">EID Number</label>
                                                <input
                                                    type="text"
                                                    value={dependent.eid_number}
                                                    onChange={(e) => updateDependent(dependent.id, 'eid_number', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                                    placeholder="784-YYYY-XXXXXXX-X"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                                <select
                                                    value={dependent.marital_status}
                                                    onChange={(e) => updateDependent(dependent.id, 'marital_status', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
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
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Sponsor</label>
                                                <select
                                                    value={dependent.relationship}
                                                    onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Emirate of Residency</label>
                                                <select
                                                    value={dependent.emirate_of_residency}
                                                    onChange={(e) => updateDependent(dependent.id, 'emirate_of_residency', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                                >
                                                    <option value="">Select Emirate</option>
                                                    {emirates.map(emirate => (
                                                        <option key={emirate} value={emirate}>{emirate}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <FileUpload
                                                    label="Emirates ID Copy"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleDependentFileChange(dependent.id, 'eid_copy', e.target.files[0])}
                                                    fileName={dependent.eid_copy?.name}
                                                    placeholder="Click to upload PDF/Image"
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
                                    className="px-8 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processing && (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Submit Application
                                </button>
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}
