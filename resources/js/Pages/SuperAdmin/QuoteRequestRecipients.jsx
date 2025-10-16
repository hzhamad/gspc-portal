import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardAside from '@/Components/DashboardAside';

export default function QuoteRequestRecipients() {
    const { props } = usePage();
    const recipients = props.recipients || [];
    const [email, setEmail] = useState('');

    const add = (e) => {
        e.preventDefault();
        if (!email) return;
        router.post('/admin/quote-recipients', { email }, { preserveState: true });
        setEmail('');
    };

    const remove = (id) => {
        if (!confirm('Remove recipient?')) return;
        router.delete(`/admin/quote-recipients/${id}`, { preserveState: true });
    };

    const toggleActive = (r) => {
        router.patch(`/admin/quote-recipients/${r.id}`, { is_active: !r.is_active }, { preserveState: true });
    };

    const edit = (r) => {
        const newEmail = prompt('Edit email', r.email);
        if (!newEmail || newEmail === r.email) return;
        router.patch(`/admin/quote-recipients/${r.id}`, { email: newEmail }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardAside currentPath="/admin/quote-recipients" />
            <div className="lg:ml-64 min-h-screen">
                <DashboardHeader title="Quote Request Recipients" subtitle="Manage notification recipients" />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <form onSubmit={add} className="flex gap-3 items-center">
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="flex-1 border rounded-lg px-3 py-2"
                            />
                            <button type="submit" className="px-4 py-2 bg-gold text-white rounded-lg font-semibold">Add</button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">Recipients</h3>

                        {recipients.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">No recipients configured.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold text-gray-700 uppercase">
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2 w-36">Active</th>
                                            <th className="px-4 py-2 w-48">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {recipients.map(r => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{r.email}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button onClick={() => toggleActive(r)} className={`px-3 py-1 rounded-full text-sm ${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                        {r.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => edit(r)} className="text-blue-600 font-medium">Edit</button>
                                                        <button onClick={() => remove(r.id)} className="text-red-600 font-medium">Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}