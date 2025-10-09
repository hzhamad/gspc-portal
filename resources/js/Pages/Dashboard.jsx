import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Dashboard(){
    const { props } = usePage();
    const sessionUser = props?.auth?.user;

    const [user, setUser] = useState(sessionUser || null);

    // Helper function to check if user has admin or super-admin role
    const isAdmin = (user) => {
        if (!user || !user.roles) return false;
        return user.roles.includes('admin') || user.roles.includes('super-admin');
    };

    // Helper function to check if user is a client
    const isClient = (user) => {
        if (!user || !user.roles) return false;
        return user.roles.includes('client');
    };

    useEffect(() => {
        if (sessionUser) {
            setUser(sessionUser);
            
            // Redirect clients to their dashboard
            if (isClient(sessionUser) && !isAdmin(sessionUser)) {
                router.visit('/client/dashboard');
            }
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            router.visit("/login");
            return;
        }
        fetch("/api/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                
                // Redirect clients to their dashboard
                if (data.user && isClient(data.user) && !isAdmin(data.user)) {
                    router.visit('/client/dashboard');
                }
            })
            .catch(() => {
                localStorage.removeItem("token");
                router.visit("/login");
            });
    }, [sessionUser]);

    const handleLogout = (e) => {
        e.preventDefault();
        const token = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.get("/logout", {}, {
            headers: { "X-CSRF-TOKEN": token },
            onFinish: () => {
                localStorage.removeItem("token");
            }
        });
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isAdmin(user)) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <aside className="w-64 bg-white shadow-lg flex flex-col p-6">
                    <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>
                    <nav className="flex flex-col gap-4">
                        <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-semibold">Dashboard</a>
                        {isAdmin(user) && (
                            <a href="/admin/users" className="text-gray-700 hover:text-blue-600 font-semibold">Users</a>
                        )}
                        <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600 font-semibold">Logout</button>
                    </nav>
                </aside>
                <main className="flex-1 p-10">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">{user.name || user.email}</span>
                    </header>
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h2 className="text-xl font-bold mb-2">Users</h2>
                            <p className="text-3xl font-bold text-blue-600">42</p>
                            <p className="text-gray-500 mt-2">Total registered users</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h2 className="text-xl font-bold mb-2">Quotes</h2>
                            <p className="text-3xl font-bold text-green-600">17</p>
                            <p className="text-gray-500 mt-2">Active insurance quotes</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h2 className="text-xl font-bold mb-2">Policies</h2>
                            <p className="text-3xl font-bold text-purple-600">8</p>
                            <p className="text-gray-500 mt-2">Active policies</p>
                        </div>
                    </section>
                </main>
            </div>
        );
    }
}
