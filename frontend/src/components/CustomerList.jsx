import { useState, useEffect } from 'react';
import api from '../api';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' });

    const fetchCustomers = async () => {
        const res = await api.get('/customers/');
        setCustomers(res.data);
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers/', form);
            setForm({ full_name: '', email: '', phone_number: '' });
            fetchCustomers();
        } catch (err) { alert('Error adding customer'); }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete customer?')) {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Customers</h2>

            {/* Add Customer Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-4 gap-4 items-end">
                <div><label className="text-sm text-gray-600">Full Name</label><input required className="w-full mt-1 p-2 border rounded" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><label className="text-sm text-gray-600">Email</label><input type="email" required className="w-full mt-1 p-2 border rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="text-sm text-gray-600">Phone</label><input required className="w-full mt-1 p-2 border rounded" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} /></div>
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">Add Customer</button>
            </form>

            {/* Customer Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm text-gray-600">
                        <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Actions</th></tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{c.full_name}</td><td className="p-4">{c.email}</td><td className="p-4">{c.phone_number}</td>
                                <td className="p-4"><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
