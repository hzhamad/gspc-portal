import React from "react";
import { usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function UserGuide() {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Unified Sidebar */}
            <DashboardAside currentPath="/support" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Unified Header */}
                <DashboardHeader
                    title="Get Support"
                    subtitle="Contact our support team for help"
                />

                <main
                    className="p-4 sm:p-6 lg:p-8 flex items-center justify-center"
                    style={{ minHeight: 'calc(100vh - 72px)' }} // adjust 72px if your header height differs
                >
                    <div className="max-w-2xl w-full">
                        {/* Flash Message */}
                        {flash.message && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{flash.message}</span>
                            </div>
                        )}

                        {/* Under maintenance Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3M12 21a9 9 0 100-18 9 9 0 000 18z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h3 className="text-lg font-bold text-gray-800">Under Maintenance</h3>
                                    <p className="text-gray-600">
                                        We're currently performing scheduled maintenance on the user guide. Some content may be temporarily unavailable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
