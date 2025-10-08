import React from 'react';
import { usePage } from '@inertiajs/react';

export default function DashboardHeader({ title, subtitle }) {
    const { props } = usePage();
    const user = props?.auth?.user;

    return (
        <header className="bg-gold border-b border-gold/20 sticky top-0 z-5 shadow-md">
            <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {title || `Welcome back, ${user?.fullname || user?.name}!`}
                        </h1>
                        {subtitle && (
                            <p className="text-white/90 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-white/80">Signed in as</p>
                            <p className="text-sm font-semibold text-white">{user?.email}</p>
                        </div>
                        {user?.profile_image ? (
                            <img 
                                src={`/storage/${user.profile_image}`} 
                                alt="Profile" 
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                                {user?.fullname?.charAt(0) || user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
