import { useState, useEffect } from 'react';
import api from '../api';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' });

    const fetchProducts = async () => {
        const res = await api.get('/products/');
        setProducts(res.data);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products/', form);
            setForm({ name: '', sku: '', price: '', quantity: '' });
            fetchProducts();
        } catch (err) { alert('Error adding product'); }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete product?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>

            {/* Add Product Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-5 gap-4 items-end">
                <div><label className="text-sm text-gray-600">Name</label><input required className="w-full mt-1 p-2 border rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="text-sm text-gray-600">SKU</label><input required className="w-full mt-1 p-2 border rounded" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                <div><label className="text-sm text-gray-600">Price ($)</label><input type="number" step="0.01" required className="w-full mt-1 p-2 border rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div><label className="text-sm text-gray-600">Quantity</label><input type="number" required className="w-full mt-1 p-2 border rounded" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
                <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition">Add Product</button>
            </form>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm text-gray-600">
                        <tr><th className="p-4">Name</th><th className="p-4">SKU</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{p.name}</td><td className="p-4 text-gray-500">{p.sku}</td>
                                <td className="p-4">${p.price.toFixed(2)}</td><td className="p-4">{p.quantity}</td>
                                <td className="p-4"><button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
