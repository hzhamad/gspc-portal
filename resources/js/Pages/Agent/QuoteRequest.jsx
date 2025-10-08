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
    const [idType, setIdType] = useState('eid'); // 'eid' or 'uid'
    const [dependents, setDependents] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        application_type: '',
        id_type: 'eid',
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

    // Validate Sponsor ID based on type
    const validateSponsorId = (value) => {
        if (idType === 'eid') {
            // Emirates ID: 784-YYYY-XXXXXXX-X (15 digits with dashes)
            const eidPattern = /^784-\d{4}-\d{7}-\d{1}$/;
            return eidPattern.test(value);
        } else {
            // Unified ID: simpler format, adjust as needed
            return value.length >= 10;
        }
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

    const handleIdTypeChange = (type) => {
        setIdType(type);
        setData('id_type', type);
        setData('sponsor_id', ''); // Reset ID when switching
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate Sponsor ID if applicable
        if ((applicationType === 'self' || applicationType === 'self_dependents') && !validateSponsorId(data.sponsor_id)) {
            alert(`Invalid ${idType === 'eid' ? 'Emirates ID' : 'Unified ID'} format`);
            return;
        }
        
        const formData = new FormData();
        formData.append('application_type', applicationType);
        formData.append('id_type', idType);
        
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
                formData.append(`dependents[${index}][emirate_of_residency]`, dep.emirate_of_residency || '');
                
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
                setIdType('eid');
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

                        {/* ID Type Selection & Principal Details */}
                        {(applicationType === 'self' || applicationType === 'self_dependents') && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Principal Applicant Details</h2>
                                
                                {/* ID Type Toggle */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">ID Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleIdTypeChange('eid')}
                                            className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                                                idType === 'eid' 
                                                    ? 'border-gold bg-gold/10 text-gold font-semibold' 
                                                    : 'border-gray-200 hover:border-gold/50'
                                            }`}
                                        >
                                            Emirates ID
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleIdTypeChange('uid')}
                                            className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                                                idType === 'uid' 
                                                    ? 'border-gold bg-gold/10 text-gold font-semibold' 
                                                    : 'border-gray-200 hover:border-gold/50'
                                            }`}
                                        >
                                            Unified ID
                                        </button>
                                    </div>
                                </div>

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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {idType === 'eid' ? 'Emirates ID' : 'Unified ID'}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sponsor_id}
                                            onChange={(e) => setData('sponsor_id', e.target.value)}
                                            placeholder={idType === 'eid' ? '784-YYYY-XXXXXXX-X' : 'Enter Unified ID'}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {idType === 'eid' 
                                                ? 'Format: 784-YYYY-XXXXXXX-X' 
                                                : 'Enter your Unified ID number'}
                                        </p>
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

                                    {/* File Upload with custom component */}
                                    <FileUpload
                                        label="Profile Picture"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('profile_picture', e.target.files[0])}
                                        fileName={data.profile_picture?.name}
                                        placeholder="Click to upload PNG/JPG"
                                        error={errors.profile_picture}
                                    />

                                    <FileUpload
                                        label={idType === 'eid' ? 'Emirates ID Copy' : 'Unified ID Copy'}
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange('eid_copy', e.target.files[0])}
                                        fileName={data.eid_copy?.name}
                                        placeholder="Click to upload PDF/Image"
                                        error={errors.eid_copy}
                                    />
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">UID Number (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={dependent.uid_number}
                                                    onChange={(e) => updateDependent(dependent.id, 'uid_number', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                                                    placeholder="Enter UID"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">EID Number (Optional)</label>
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

                                            <FileUpload
                                                label="Profile Picture"
                                                accept="image/*"
                                                onChange={(e) => handleDependentFileChange(dependent.id, 'profile_picture', e.target.files[0])}
                                                fileName={dependent.profile_picture?.name}
                                                placeholder="Click to upload PNG/JPG"
                                            />

                                            <FileUpload
                                                label="Emirates ID Copy"
                                                accept="image/*,.pdf"
                                                onChange={(e) => handleDependentFileChange(dependent.id, 'eid_copy', e.target.files[0])}
                                                fileName={dependent.eid_copy?.name}
                                                placeholder="Click to upload PDF/Image"
                                            />
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
