import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Toast() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);
    const [nextId, setNextId] = useState(0);

    useEffect(() => {
        const newToasts = [];
        
        // Handle flash messages first
        if (flash?.success) {
            newToasts.push({ id: nextId, msg: flash.success, type: 'success' });
            setNextId(prev => prev + 1);
        } else if (flash?.error) {
            newToasts.push({ id: nextId, msg: flash.error, type: 'error' });
            setNextId(prev => prev + 1);
        } else if (flash?.warning) {
            newToasts.push({ id: nextId, msg: flash.warning, type: 'warning' });
            setNextId(prev => prev + 1);
        } else if (flash?.info) {
            newToasts.push({ id: nextId, msg: flash.info, type: 'info' });
            setNextId(prev => prev + 1);
        }
        
        // Handle validation errors - show each error as a separate toast
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors);
            errorMessages.forEach((err, index) => {
                newToasts.push({ id: nextId + index + 1, msg: err, type: 'error' });
            });
            setNextId(prev => prev + errorMessages.length + 1);
        }
        
        if (newToasts.length > 0) {
            setToasts(prev => [...prev, ...newToasts]);
            
            // Auto-remove each toast after 5 seconds
            newToasts.forEach((toast) => {
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                }, 5000);
            });
        }
    }, [flash, errors]);

    const handleClose = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (toasts.length === 0) return null;

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-800',
            icon: 'text-green-500',
            iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800',
            icon: 'text-red-500',
            iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-800',
            icon: 'text-yellow-500',
            iconPath: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: 'text-blue-500',
            iconPath: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
            {toasts.map((toast, index) => {
                const currentStyle = styles[toast.type];
                
                return (
                    <div
                        key={toast.id}
                        className="animate-slide-in-up"
                        role="alert"
                        style={{
                            animationDelay: `${index * 0.1}s`
                        }}
                    >
                        <div className={`${currentStyle.bg} border-l-4 ${currentStyle.border} p-4 rounded-lg shadow-xl flex items-start gap-3`}>
                            <svg
                                className={`w-6 h-6 ${currentStyle.icon} shrink-0`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d={currentStyle.iconPath} clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className={`${currentStyle.text} font-medium text-sm`}>{toast.msg}</p>
                            </div>
                            <button
                                onClick={() => handleClose(toast.id)}
                                className={`${currentStyle.icon} hover:opacity-70 transition-opacity shrink-0`}
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
