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
            console.debug('FormLoader onStart event:', event?.detail || event);
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
            console.debug('FormLoader router start event:', event);
            if (event && event.method && event.method.toUpperCase() !== 'GET') {
                setLoading(true);
            }
        });
    // Listen for router finish to hide loader
    router.on('finish', () => setLoading(false));

        // Do not expose debug helpers in normal operation

        // Monkey-patch router methods (post/put/delete/visit) so the loader shows immediately
        // when those methods are invoked (covers direct router.post(...) usages).
        const originalRouter = {
            post: router.post,
            put: router.put,
            delete: router.delete,
            visit: router.visit,
        };

        try {
            if (originalRouter.post) {
                router.post = function (...args) {
                    setLoading(true);
                    return originalRouter.post.apply(this, args);
                };
            }
            if (originalRouter.put) {
                router.put = function (...args) {
                    setLoading(true);
                    return originalRouter.put.apply(this, args);
                };
            }
            if (originalRouter.delete) {
                router.delete = function (...args) {
                    setLoading(true);
                    return originalRouter.delete.apply(this, args);
                };
            }
            if (originalRouter.visit) {
                router.visit = function (...args) {
                    setLoading(true);
                    return originalRouter.visit.apply(this, args);
                };
            }
        } catch (e) {
            console.warn('FormLoader: could not monkey-patch router methods', e);
        }

        return () => {
            window.removeEventListener('inertia:start', onStart);
            window.removeEventListener('inertia:finish', onFinish);
            window.removeEventListener('inertia:error', onError);
            router.off('start');
            router.off('finish');
            // Restore original router methods
            try {
                if (originalRouter.post) router.post = originalRouter.post;
                if (originalRouter.put) router.put = originalRouter.put;
                if (originalRouter.delete) router.delete = originalRouter.delete;
                if (originalRouter.visit) router.visit = originalRouter.visit;
            } catch (e) {
                // ignore
            }
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="bg-white/95 rounded-xl p-6 flex flex-col items-center gap-4 shadow-xl w-80 max-w-[90%]">
                {/* Formal logo animation - subtle scale and fade */}
                <div className="w-24 h-24 flex items-center justify-center">
                    {/* Use official UAE logo; keep responsive sizing and subtle animation */}
                    <img
                        src="/images/uae_logo.svg"
                        alt="UAE Logo"
                        className="w-full h-full object-contain animate-pulse"
                    />
                </div>

                <div className="text-center">
                    <p className="text-gray-800 font-semibold text-lg">Submitting…</p>
                    <p className="text-sm text-gray-600">Please wait while we process your request</p>
                </div>
            </div>
        </div>
    );
}
