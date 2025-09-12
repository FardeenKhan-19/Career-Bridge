import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending reset email...');
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent! Please check your inbox.', { id: toastId, duration: 5000 });
        } catch (error) {
            toast.error('Failed to send reset email. Please check the address and try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a password reset link.">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none w-full disabled:bg-gray-400" type="submit">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p className="text-center text-gray-600 text-sm mt-6">
                Remembered your password? <Link to="/login" className="font-bold text-teal-600 hover:text-teal-800">Log In</Link>
            </p>
        </AuthLayout>
    );
};
