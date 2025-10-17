import React from "react";
import { usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function GetSupport() {
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

				<main className="p-4 sm:p-6 lg:p-8">
					<div className="max-w-2xl mx-auto">
						{/* Flash Message */}
						{flash.message && (
							<div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start">
								<svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
								</svg>
								<span>{flash.message}</span>
							</div>
						)}

						{/* Support Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
							<div className="mb-6">
								<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Support Options</h2>
								<p className="text-gray-600 mt-2">
									If you need assistance, please choose one of the following support options:
								</p>
							</div>

							<div className="space-y-4 text-gray-700">
								<div className="p-4 bg-gray-50 border border-gray-100 rounded">
									<h3 className="font-semibold text-gray-800">Email Support</h3>
									<p className="text-sm text-gray-600 mt-1">
										Reach out to our support team at{' '}
										<a href="mailto:reham@click2secure.me" className="text-blue-600 underline">reham@click2secure.me</a>
									</p>
								</div>

								<div className="p-4 bg-green-50 border border-green-100 rounded flex items-center justify-between">
									<div>
										<h3 className="font-semibold text-gray-800">WhatsApp</h3>
										<p className="text-sm text-gray-600 mt-1">
											Send us a WhatsApp message at <span className="font-medium">+971 52 251 4138</span>
										</p>
									</div>
									<a
										href={`https://wa.me/971522514138?text=${encodeURIComponent('Hello, I need support with my account. Can you help?')}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
										aria-label="Send WhatsApp message"
									>
										Message
									</a>
								</div>

								{/* Optional: additional instructions */}
								<div className="text-sm text-gray-500">
									<p>
										Our support hours are Monday–Friday, 9am–5pm. For urgent issues outside these hours, please include "URGENT" in your email subject or call the phone support number.
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
