import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: [] });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, customersRes, ordersRes] = await Promise.all([
                    api.get('/products/'),
                    api.get('/customers/'),
                    api.get('/orders/')
                ]);

                const products = productsRes.data;
                setStats({
                    products: products.length,
                    customers: customersRes.data.length,
                    orders: ordersRes.data.length,
                    lowStock: products.filter(p => p.quantity < 10)
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24} /></div>
                    <div><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-bold">{stats.products}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
                    <div><p className="text-sm text-gray-500">Total Customers</p><p className="text-2xl font-bold">{stats.customers}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ShoppingCart size={24} /></div>
                    <div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{stats.orders}</p></div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-red-50 flex items-center gap-2 text-red-700">
                    <AlertTriangle size={20} />
                    <h3 className="font-semibold">Low Stock Alerts (Less than 10 items)</h3>
                </div>
                <div className="p-4">
                    {stats.lowStock.length === 0 ? (
                        <p className="text-gray-500">All products have sufficient stock.</p>
                    ) : (
                        <ul className="space-y-2">
                            {stats.lowStock.map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm border-b pb-2">
                                    <span>{p.name} (SKU: {p.sku})</span>
                                    <span className="font-semibold text-red-600">{p.quantity} left</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
