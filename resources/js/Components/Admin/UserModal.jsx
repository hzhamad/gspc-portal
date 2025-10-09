import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function UserModal({ mode, user, onClose }) {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: true,
        role: 'client'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && (mode === 'view' || mode === 'edit')) {
            setFormData({
                first_name: user.first_name || '',
                middle_name: user.middle_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                password: '',
                password_confirmation: '',
                status: user.status ?? true,
                role: user.roles?.[0]?.name || 'client'
            });
        }
    }, [user, mode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const submitData = { ...formData };
        if (mode === 'edit' && !submitData.password) {
            delete submitData.password;
            delete submitData.password_confirmation;
        }

        const url = mode === 'create' ? '/admin/users' : `/admin/users/${user.id}`;
        const method = mode === 'create' ? 'post' : 'put';

        router[method](url, submitData, {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-gold to-gold/80 text-white px-6 py-5 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {isCreateMode && 'Create New User'}
                            {isViewMode && 'User Details'}
                            {isEditMode && 'Edit User'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                    isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                } ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                    isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                } ${errors.middle_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                    isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                } ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                    isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {!isViewMode && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password {isCreateMode && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required={isCreateMode}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password {isCreateMode && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required={isCreateMode}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                                    isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                } ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                                <option value="super-admin">Super Admin</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className="w-5 h-5 text-gold border-gray-300 rounded focus:ring-gold disabled:cursor-not-allowed"
                                />
                                <span className="text-sm font-medium text-gray-700">Active Status</span>
                            </label>
                        </div>
                    </div>

                    {isViewMode && user && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Last Updated:</span> {new Date(user.updated_at).toLocaleString()}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        {isViewMode ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => {
                                            const event = new CustomEvent('editUser', { detail: user });
                                            window.dispatchEvent(event);
                                        }, 100);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all"
                                >
                                    Edit User
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:brightness-110 transition-all ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Saving...' : isCreateMode ? 'Create User' : 'Save Changes'}
                                </button>
                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
