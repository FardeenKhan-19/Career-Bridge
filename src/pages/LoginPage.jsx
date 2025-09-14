import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout.jsx';

// Simple Google Icon component for the button
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.617-3.473-11.188-8.064l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,36.593,44,31.016,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
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

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        const toastId = toast.loading('Signing in with Google...');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // If the user doesn't exist in Firestore, create a new document for them
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    role: 'student', // Default role for users signing up via login page
                    createdAt: Timestamp.now(),
                    lastLoginAt: Timestamp.now(),
                    profile: {
                        headline: "", bio: "", location: "", linkedinUrl: "", portfolioUrl: "",
                        profileImageUrl: user.photoURL || "https://placehold.co/400x400/EBF4FF/76A9FA?text=Avatar",
                        skills: []
                    },
                    isProfileComplete: false
                });
            }

            toast.success('Signed in successfully!', { id: toastId });
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to sign in with Google.', { id: toastId });
            console.error("Google sign-in error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to continue">
            <form onSubmit={handleEmailSubmit}>
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

            {/* Google Sign-In Button */}
            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <button onClick={handleGoogleSignIn} disabled={loading} className="mt-6 w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none disabled:bg-gray-200">
                <GoogleIcon />
                Sign in with Google
            </button>


            <p className="text-center text-gray-600 text-sm mt-6">
                Don't have an account? <Link to="/register" className="font-bold text-teal-600 hover:text-teal-800">Sign Up</Link>
            </p>
        </AuthLayout>
    );
};
