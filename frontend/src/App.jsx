import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import CustomerList from './components/CustomerList';
import OrderList from './components/OrderList';

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar */}
                <nav className="w-64 bg-white border-r shadow-sm">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold text-indigo-600">InventoryPro</h1>
                    </div>
                    <ul className="p-4 space-y-2">
                        <li>
                            <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                                <Package size={20} /> Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/customers" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                                <Users size={20} /> Customers
                            </Link>
                        </li>
                        <li>
                            <Link to="/orders" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                                <ShoppingCart size={20} /> Orders
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/orders" element={<OrderList />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
