import React from "react";
import { router } from "@inertiajs/react";

const Home = () => {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
            <svg
                className="absolute inset-0 w-full h-full z-0"
                viewBox="0 0 1440 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ pointerEvents: "none" }}
            >
                <defs>
                    <radialGradient
                        id="bgGradient"
                        cx="50%"
                        cy="50%"
                        r="80%"
                        fx="50%"
                        fy="50%"
                        gradientTransform="rotate(45)"
                    >
                        <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.2"
                        />
                        <stop
                            offset="50%"
                            stopColor="#a5b4fc"
                            stopOpacity="0.15"
                        />
                        <stop
                            offset="100%"
                            stopColor="#f0f9ff"
                            stopOpacity="0.1"
                        />
                    </radialGradient>
                </defs>
                <ellipse
                    cx="720"
                    cy="512"
                    rx="900"
                    ry="500"
                    fill="url(#bgGradient)"
                />
                <circle
                    cx="300"
                    cy="200"
                    r="180"
                    fill="#3b82f6"
                    opacity="0.08"
                />
                <circle
                    cx="1200"
                    cy="900"
                    r="220"
                    fill="#6366f1"
                    opacity="0.07"
                />
                <circle
                    cx="1100"
                    cy="200"
                    r="120"
                    fill="#06b6d4"
                    opacity="0.07"
                />
            </svg>
            <header className="w-full py-8 flex flex-col items-center z-10">
                <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
                    GSPC Portal
                </h1>
                <p className="text-lg text-gray-600 mb-6 max-w-xl text-center">
                    Your trusted healthcare companion. Connect with doctors,
                    manage appointments, and access medical services all in one
                    secure platform.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.visit("/dashboard")}
                        className="px-6 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 font-semibold"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </header>
            <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 z-10">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">
                        Find Doctors
                    </h2>
                    <p className="text-gray-500">
                        Connect with qualified healthcare professionals in your
                        area.
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-xl font-bold text-green-600 mb-2">
                        Book Appointments
                    </h2>
                    <p className="text-gray-500">
                        Schedule and manage your medical appointments with ease.
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-xl font-bold text-purple-600 mb-2">
                        Medical Records
                    </h2>
                    <p className="text-gray-500">
                        Securely store and access your health records anytime,
                        anywhere.
                    </p>
                </div>
            </section>
            <footer className="mt-16 text-gray-400 text-sm z-10">
                &copy; {new Date().getFullYear()} GSPC Portal. All rights
                reserved.
            </footer>
        </div>
    );
};

export default Home;
