import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js'; // Corrected import path
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout.jsx'; // Corrected import path

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Signing in...');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Signed in successfully!', { id: toastId });
            navigate('/dashboard');
        } catch (error) {
            toast.error('Invalid email or password.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to continue">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                        id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="text-right">
                        <Link className="font-bold text-sm text-teal-600 hover:text-teal-800" to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
                <button disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none w-full disabled:bg-gray-400" type="submit">
                    {loading ? 'Signing In...' : 'Log In'}
                </button>
            </form>
            <p className="text-center text-gray-600 text-sm mt-6">
                Don't have an account? <Link to="/register" className="font-bold text-teal-600 hover:text-teal-800">Sign Up</Link>
            </p>
        </AuthLayout>
    );
};

