import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Formal loader overlay used during form submissions and other non-GET visits.
// Shows a centered logo animation and blocks interaction while a request is in progress.
export default function FormLoader() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onStart = (event) => {
            // Inertia fires visits for navigation and form posts. Only show loader for non-GET requests
            const method = event.detail?.method || event.detail?.page?.props?._method;
            // event.detail has 'method' on start events, but fallback: check the visit's method
            if (event.detail && event.detail.method && event.detail.method.toUpperCase() !== 'GET') {
                setLoading(true);
            } else if (event.detail && event.detail.visit && event.detail.visit.method && event.detail.visit.method.toUpperCase() !== 'GET') {
                setLoading(true);
            }
        };

        const onFinish = () => setLoading(false);
        const onError = () => setLoading(false);

        window.addEventListener('inertia:start', onStart);
        window.addEventListener('inertia:finish', onFinish);
        window.addEventListener('inertia:error', onError);

        // As a fallback, listen to Inertia progress events
        router.on('start', (event) => {
            if (event && event.method && event.method.toUpperCase() !== 'GET') {
                setLoading(true);
            }
        });
        router.on('finish', () => setLoading(false));

        return () => {
            window.removeEventListener('inertia:start', onStart);
            window.removeEventListener('inertia:finish', onFinish);
            window.removeEventListener('inertia:error', onError);
            router.off('start');
            router.off('finish');
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="bg-white/95 rounded-xl p-6 flex flex-col items-center gap-4 shadow-xl w-80 max-w-[90%]">
                {/* Formal logo animation - subtle scale and fade */}
                <div className="w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#b88b2f" />
                                <stop offset="100%" stopColor="#8b6b24" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="40" fill="url(#g)" opacity="0.12" />
                        <g fill="#b88b2f">
                            <path d="M50 20 L60 40 L80 44 L64 58 L68 80 L50 68 L32 80 L36 58 L20 44 L40 40 Z" opacity="0.95" />
                        </g>
                    </svg>
                </div>

                <div className="text-center">
                    <p className="text-gray-800 font-semibold text-lg">Submitting…</p>
                    <p className="text-sm text-gray-600">Please wait while we process your request</p>
                </div>
            </div>
        </div>
    );
}
