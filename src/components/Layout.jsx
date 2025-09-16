import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { Logo, UserCircleIcon } from './Icons.jsx';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) { console.error("Failed to log out:", error); }
    };

    const isHomePage = location.pathname === '/';
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Logo />
                    <span className="text-xl font-bold text-gray-800">CareerBridge</span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {/* The "Home" link has been completely removed as requested. */}
                    {user && user.role === 'student' && <Link to="/courses" className="text-gray-600 hover:text-teal-600">Courses</Link>}
                    {user && !isAdminPage && <Link to="/dashboard" className="text-gray-600 hover:text-teal-600">Dashboard</Link>}
                    {user && !isAdminPage && <Link to="/chat" className="text-gray-600 hover:text-teal-600">Messages</Link>} {/* <-- Change yahan kiya hai */}
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center text-gray-600 hover:text-teal-600">
                                <UserCircleIcon />
                                <span className="ml-2 hidden sm:inline">{user.displayName || user.email}</span>
                            </Link>
                            <button onClick={handleLogout} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">Logout</button>
                        </div>
                    ) : (
                        !isHomePage && (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-teal-600">Login</Link>
                                <Link to="/register" className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300">Sign Up</Link>
                            </>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto py-6 px-6 text-center text-gray-600">
            <p>&copy; 2025 CareerBridge</p>
            <div className="mt-2 space-x-4">
                <Link to="/about" className="hover:text-teal-600">About Us</Link>
                <Link to="/contact" className="hover:text-teal-600">Contact</Link>
                <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
            </div>
        </div>
    </footer>
);

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user && location.pathname === '/') {
            navigate('/dashboard', { replace: true });
        }
    }, [user, location.pathname, navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Toaster position="top-center" reverseOrder={false} />
            <Header />
            <main className="relative z-10 flex-grow p-6">
                <div className="container mx-auto">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};