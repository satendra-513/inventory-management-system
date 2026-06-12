import { useState, useEffect } from 'react';
import api from '../api';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    // Simple order form state (supports 1 product for simplicity)
    const [form, setForm] = useState({ customer_id: '', product_id: '', quantity: 1 });

    const fetchData = async () => {
        const [ordRes, custRes, prodRes] = await Promise.all([
            api.get('/orders/'), api.get('/customers/'), api.get('/products/')
        ]);
        setOrders(ordRes.data); setCustomers(custRes.data); setProducts(prodRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders/', {
                customer_id: parseInt(form.customer_id),
                items: [{ product_id: parseInt(form.product_id), quantity: parseInt(form.quantity) }]
            });
            setForm({ customer_id: '', product_id: '', quantity: 1 });
            fetchData(); // Refresh data to show new stock and orders
        } catch (err) { alert(err.response?.data?.detail || 'Error creating order'); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

            {/* Create Order Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-4 gap-4 items-end">
                <div>
                    <label className="text-sm text-gray-600">Customer</label>
                    <select required className="w-full mt-1 p-2 border rounded" value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                        <option value="">Select Customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-600">Product</label>
                    <select required className="w-full mt-1 p-2 border rounded" value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })}>
                        <option value="">Select Product...</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price} - {p.quantity} left)</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-600">Quantity</label>
                    <input type="number" min="1" required className="w-full mt-1 p-2 border rounded" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition">Place Order</button>
            </form>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm text-gray-600">
                        <tr><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Customer ID</th><th className="p-4">Total Amount</th></tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-semibold text-gray-700">#{o.id}</td>
                                <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
                                <td className="p-4">Cust ID: {o.customer_id}</td>
                                <td className="p-4 font-bold text-green-600">${o.total_amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No orders found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
