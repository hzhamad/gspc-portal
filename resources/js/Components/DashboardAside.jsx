import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function DashboardAside({ currentPath }) {
    const { props } = usePage();
    const user = props?.auth?.user;
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const isActive = (path) => {
        if (!currentPath) {
            currentPath = window.location.pathname;
        }
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    // Check if user is admin
    const isAdmin = user?.roles?.some(role =>
        role === 'admin' || role === 'super-admin'
    );

    // Admin menu items
    let adminMenuItems = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        // Email Recipients is only shown to super-admins (inserted below when detected)
        {
            name: 'Quote Requests',
            path: '/admin/quote-requests',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    // add super-admin-only link
    // Normalize super-admin detection to use the roles array (consistent with isAdmin)
    const isSuperAdmin = user?.roles?.some(role => role === 'super-admin');
    if (isSuperAdmin) {
        // Insert Email Recipients after 'Users' (index 2) so admin ordering remains logical
        adminMenuItems.splice(2, 0, {
            name: 'Email Recipients',
            path: '/admin/quote-recipients',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2.5" y="5.5" width="19" height="13" rx="2" ry="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 7.5l8 6 8-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        });
    }

    // Client menu items
    const clientMenuItems = [
        {
            name: 'Dashboard',
            path: '/client/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'New Application',
            path: '/quote-request',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            )
        },
        {
            name: 'My Requests',
            path: '/my-requests',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gold text-white rounded-lg shadow-lg hover:brightness-110 transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-40 transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            <div className="p-6">
                {/* Logo Section with Gold Background */}
                <a href={isAdmin ? "/admin/dashboard" : "/client/dashboard"} className="bg-gradient-to-br from-gold to-gold/80 rounded-xl p-4 mb-8 shadow-lg block">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white/30">
                            <img
                                src="/images/uae_logo.svg"
                                alt="UAE Logo"
                                className="w-6 h-8"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">GSPC Portal</h2>
                            <p className="text-xs text-white/80">Health Insurance</p>
                        </div>
                    </div>
                </a>

                {/* Navigation */}
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                isActive(item.path)
                                    ? 'bg-gold text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                            }`}
                        >
                            <span className={isActive(item.path) ? 'text-white' : ''}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </a>
                    ))}

                    <hr className="my-4 border-gray-200" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors w-full text-left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </nav>

                {/* User Info at Bottom */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        {user?.profile_picture ? (
                            <img
                                src={`/storage/${user.profile_picture}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gold/20"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user?.fullname?.charAt(0) || user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {user?.fullname || user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        </>
    );
}
