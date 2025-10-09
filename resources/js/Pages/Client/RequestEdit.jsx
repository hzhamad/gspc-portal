import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import DashboardAside from '@/Components/DashboardAside';
import DashboardHeader from '@/Components/DashboardHeader';
import EidInput from '@/Components/EidInput';

export default function RequestEdit() {
    const { props } = usePage();
    const request = props?.request || {};
    const dependents = request?.dependents || [];
    const emirates = props?.emirates || [];

    const { data, setData, post, processing, errors } = useForm({
        application_type: request.application_type || 'self',
        sponsor_name: request.sponsor_name || '',
        sponsor_id: request.sponsor_id || '',
        dob: request.dob || '',
        emirate_of_residency: request.emirate_of_residency || '',
        profile_picture: null,
        eid_file: null,
        dependents: dependents.map(dep => ({
            id: dep.id,
            first_name: dep.first_name || '',
            middle_name: dep.middle_name || '',
            last_name: dep.last_name || '',
            uid_number: dep.uid_number || '',
            eid_number: dep.eid_number || '',
            marital_status: dep.marital_status || 'single',
            dob: dep.dob || '',
            relationship: dep.relationship || 'spouse',
            profile_picture: null,
            eid_file: null,
            existing_profile_picture: dep.profile_picture,
            existing_eid_file: dep.eid_file,
        })),
        _method: 'PUT'
    });

    const [profilePicturePreview, setProfilePicturePreview] = useState(
        request.profile_picture ? `/storage/${request.profile_picture}` : null
    );
    const [eidCopyPreview, setEidCopyPreview] = useState(
        request.eid_file ? `/storage/${request.eid_file}` : null
    );

    const updateDependentField = (index, field, value) => {
        const updatedDependents = data.dependents.map((dependent, dependentIndex) =>
            dependentIndex === index ? { ...dependent, [field]: value } : dependent
        );
        setData('dependents', updatedDependents);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if ((data.application_type === 'dependents' || data.application_type === 'self_dependents') && data.dependents.length > 0) {
            for (const dependent of data.dependents) {
                if (!dependent.first_name?.trim() || !dependent.last_name?.trim()) {
                    alert('Please provide first and last name for each dependent.');
                    return;
                }
            }
        }

        const formData = new FormData();
        
        // Add basic fields
        formData.append('application_type', data.application_type);
        formData.append('_method', 'PUT');
        
        // Add principal fields if applicable
        if (data.application_type === 'self' || data.application_type === 'self_dependents') {
            formData.append('sponsor_name', data.sponsor_name);
            formData.append('sponsor_id', data.sponsor_id);
            formData.append('dob', data.dob);
            formData.append('emirate_of_residency', data.emirate_of_residency);
            
            if (data.profile_picture) {
                formData.append('profile_picture', data.profile_picture);
            }
            if (data.eid_file) {
                formData.append('eid_file', data.eid_file);
            }
        }
        
        // Add dependents if applicable
        if ((data.application_type === 'dependents' || data.application_type === 'self_dependents') && data.dependents.length > 0) {
            data.dependents.forEach((dependent, index) => {
                if (dependent.id) {
                    formData.append(`dependents[${index}][id]`, dependent.id);
                }
                formData.append(`dependents[${index}][first_name]`, dependent.first_name);
                formData.append(`dependents[${index}][middle_name]`, dependent.middle_name || '');
                formData.append(`dependents[${index}][last_name]`, dependent.last_name);
                formData.append(`dependents[${index}][uid_number]`, dependent.uid_number || '');
                formData.append(`dependents[${index}][eid_number]`, dependent.eid_number || '');
                formData.append(`dependents[${index}][marital_status]`, dependent.marital_status);
                formData.append(`dependents[${index}][dob]`, dependent.dob);
                formData.append(`dependents[${index}][relationship]`, dependent.relationship);
                
                if (dependent.profile_picture) {
                    formData.append(`dependents[${index}][profile_picture]`, dependent.profile_picture);
                }
                if (dependent.eid_file) {
                    formData.append(`dependents[${index}][eid_file]`, dependent.eid_file);
                }
            });
        }

        router.post(`/my-requests/${request.id}`, formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.visit(`/my-requests/${request.id}`);
            }
        });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'profile_picture') {
                    setProfilePicturePreview(reader.result);
                } else if (field === 'eid_file') {
                    setEidCopyPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDependentFileChange = (index, field, file) => {
        const newDependents = [...data.dependents];
        newDependents[index][field] = file;
        setData('dependents', newDependents);
    };

    const addDependent = () => {
        setData('dependents', [
            ...data.dependents,
            {
                first_name: '',
                middle_name: '',
                last_name: '',
                uid_number: '',
                eid_number: '',
                marital_status: 'single',
                dob: '',
                relationship: 'spouse',
                profile_picture: null,
                eid_file: null,
            }
        ]);
    };

    const removeDependent = (index) => {
        const newDependents = data.dependents.filter((_, i) => i !== index);
        setData('dependents', newDependents);
    };

    const showPrincipalFields = data.application_type === 'self' || data.application_type === 'self_dependents';
    const showDependentsFields = data.application_type === 'dependents' || data.application_type === 'self_dependents';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/my-requests" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header with Gold Background */}
                <DashboardHeader 
                    title={`Edit Application #${request.id}`}
                    subtitle="Update your insurance application details"
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit(`/my-requests/${request.id}`)}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Application Details
                        </button>
                    </div>

                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-blue-800 mb-1">Note about editing</h4>
                                <p className="text-blue-700 text-sm">
                                    You can only edit applications with "Pending Review" status. Changes will reset the review process.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Application Type */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Application Type</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors">
                                    <input
                                        type="radio"
                                        name="application_type"
                                        value="self"
                                        checked={data.application_type === 'self'}
                                        onChange={(e) => setData('application_type', e.target.value)}
                                        className="w-5 h-5 text-gold focus:ring-gold"
                                        disabled
                                    />
                                    <span className="ml-3 font-medium text-gray-800">Self Only</span>
                                </label>

                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors">
                                    <input
                                        type="radio"
                                        name="application_type"
                                        value="self_dependents"
                                        checked={data.application_type === 'self_dependents'}
                                        onChange={(e) => setData('application_type', e.target.value)}
                                        className="w-5 h-5 text-gold focus:ring-gold"
                                        disabled
                                    />
                                    <span className="ml-3 font-medium text-gray-800">Self + Dependents</span>
                                </label>

                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors">
                                    <input
                                        type="radio"
                                        name="application_type"
                                        value="dependents"
                                        checked={data.application_type === 'dependents'}
                                        onChange={(e) => setData('application_type', e.target.value)}
                                        className="w-5 h-5 text-gold focus:ring-gold"
                                        disabled
                                    />
                                    <span className="ml-3 font-medium text-gray-800">Dependents Only</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                Note: Application type cannot be changed after submission.
                            </p>
                        </div>

                        {/* Principal Information */}
                        {showPrincipalFields && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Principal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sponsor Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sponsor_name}
                                            onChange={(e) => setData('sponsor_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                            placeholder="Full name as per Emirates ID"
                                        />
                                        {errors.sponsor_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.sponsor_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <EidInput
                                            label="Sponsor ID Number"
                                            value={data.sponsor_id}
                                            onChange={(val) => setData('sponsor_id', val)}
                                            required
                                            helperText="Format: 784-YYYY-NNNNNNN-N"
                                            error={errors.sponsor_id}
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                        {errors.dob && (
                                            <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Emirate of Residency <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.emirate_of_residency}
                                            onChange={(e) => setData('emirate_of_residency', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        >
                                            <option value="">Select Emirate</option>
                                            {emirates.map((emirate) => (
                                                <option key={emirate} value={emirate}>
                                                    {emirate}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.emirate_of_residency && (
                                            <p className="text-red-500 text-sm mt-1">{errors.emirate_of_residency}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Picture
                                        </label>
                                        {profilePicturePreview && (
                                            <div className="mb-3">
                                                <img 
                                                    src={profilePicturePreview} 
                                                    alt="Preview" 
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={(e) => handleFileChange(e, 'profile_picture')}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, JPEG, PNG</p>
                                        {errors.profile_picture && (
                                            <p className="text-red-500 text-sm mt-1">{errors.profile_picture}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Emirates ID Copy
                                        </label>
                                        {eidCopyPreview && (
                                            <div className="mb-3">
                                                <a 
                                                    href={eidCopyPreview} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View current file
                                                </a>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                                            onChange={(e) => handleFileChange(e, 'eid_file')}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, JPEG, PNG, PDF</p>
                                        {errors.eid_file && (
                                            <p className="text-red-500 text-sm mt-1">{errors.eid_file}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dependents Section */}
                        {showDependentsFields && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Dependents Information</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addDependent}
                                        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Dependent
                                    </button>
                                </div>

                                {data.dependents.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-gray-600 mb-4">No dependents added yet</p>
                                        <button
                                            type="button"
                                            onClick={addDependent}
                                            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Add Your First Dependent
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {data.dependents.map((dependent, index) => {
                                            const getDependentError = (field) => errors?.[`dependents.${index}.${field}`];

                                            return (
                                                <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-bold text-gray-800">Dependent #{index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDependent(index)}
                                                            className="px-3 py-1.5 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                First Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dependent.first_name}
                                                                onChange={(e) => updateDependentField(index, 'first_name', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                                required
                                                            />
                                                            {getDependentError('first_name') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('first_name')}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Middle Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dependent.middle_name}
                                                                onChange={(e) => updateDependentField(index, 'middle_name', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            />
                                                            {getDependentError('middle_name') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('middle_name')}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Last Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dependent.last_name}
                                                                onChange={(e) => updateDependentField(index, 'last_name', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                                required
                                                            />
                                                            {getDependentError('last_name') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('last_name')}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                UID Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dependent.uid_number}
                                                                onChange={(e) => updateDependentField(index, 'uid_number', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                                placeholder="Optional"
                                                            />
                                                            {getDependentError('uid_number') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('uid_number')}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <EidInput
                                                                label="Emirates ID Number *"
                                                                value={dependent.eid_number}
                                                                onChange={(val) => updateDependentField(index, 'eid_number', val)}
                                                                helperText="Format: 784-YYYY-NNNNNNN-N"
                                                                error={getDependentError('eid_number')}
                                                                disabled={processing}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Date of Birth <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={dependent.dob}
                                                                onChange={(e) => updateDependentField(index, 'dob', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            />
                                                            {getDependentError('dob') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('dob')}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Relationship <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={dependent.relationship}
                                                                onChange={(e) => updateDependentField(index, 'relationship', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            >
                                                                <option value="spouse">Spouse</option>
                                                                <option value="child">Child</option>
                                                                <option value="parent">Parent</option>
                                                                <option value="sibling">Sibling</option>
                                                            </select>
                                                            {getDependentError('relationship') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('relationship')}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Marital Status <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={dependent.marital_status}
                                                                onChange={(e) => updateDependentField(index, 'marital_status', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            >
                                                                <option value="single">Single</option>
                                                                <option value="married">Married</option>
                                                            </select>
                                                            {getDependentError('marital_status') && (
                                                                <p className="text-red-500 text-sm mt-1">{getDependentError('marital_status')}</p>
                                                            )}
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Profile Picture
                                                            </label>
                                                            {dependent.existing_profile_picture && !dependent.profile_picture && (
                                                                <div className="mb-2">
                                                                    <img 
                                                                        src={`/storage/${dependent.existing_profile_picture}`} 
                                                                        alt="Current" 
                                                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                                                    />
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/jpg"
                                                                onChange={(e) => handleDependentFileChange(index, 'profile_picture', e.target.files[0])}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, JPEG, PNG</p>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Emirates ID Copy
                                                            </label>
                                                            {dependent.existing_eid_file && !dependent.eid_file && (
                                                                <div className="mb-2">
                                                                    <a 
                                                                        href={`/storage/${dependent.existing_eid_file}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline text-sm"
                                                                    >
                                                                        View current file
                                                                    </a>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/jpg,application/pdf"
                                                                onChange={(e) => handleDependentFileChange(index, 'eid_file', e.target.files[0])}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, JPEG, PNG, PDF</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => router.visit(`/my-requests/${request.id}`)}
                                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

