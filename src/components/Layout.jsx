import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { Logo, UserCircleIcon } from './Icons.jsx';
// We don't need to import Toaster here anymore
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

    // Style for active NavLink
    const navLinkStyle = ({ isActive }) =>
        "text-gray-600 hover:text-teal-600 transition-colors" +
        (isActive ? " font-bold text-teal-600" : "");


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Logo />
                    <span className="text-xl font-bold text-gray-800">CareerBridge</span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {user && user.role === 'student' && <NavLink to="/courses" className={navLinkStyle}>Courses</NavLink>}
                    {user && user.role === 'student' && <NavLink to="/resources" className={navLinkStyle}>Resources</NavLink>}
                    {user && user.role === 'student' && <NavLink to="/companies" className={navLinkStyle}>Companies</NavLink>}
                    {user && !isAdminPage && <NavLink to="/dashboard" className={navLinkStyle}>Dashboard</NavLink>}
                    {user && !isAdminPage && <NavLink to="/chat" className={navLinkStyle}>Messages</NavLink>}
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
            {/* The duplicate Toaster component has been removed from this file. */}
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