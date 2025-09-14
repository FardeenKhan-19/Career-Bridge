import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

// Simple Google Icon component for the button
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.617-3.473-11.188-8.064l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,36.593,44,31.016,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Creating account...');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: fullName,
                role: role,
                createdAt: Timestamp.now(),
                lastLoginAt: Timestamp.now(),
                profile: {
                    headline: "", bio: "", location: "", linkedinUrl: "", portfolioUrl: "",
                    profileImageUrl: "https://placehold.co/400x400/EBF4FF/76A9FA?text=Avatar",
                    skills: []
                },
                isProfileComplete: false
            });

            toast.success('Account created successfully!', { id: toastId });
            navigate('/dashboard');

        } catch (error) {
            const errorMessage = error.message.includes('auth/email-already-in-use')
                ? 'This email is already in use.'
                : 'Failed to create an account. Please try again.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        const toastId = toast.loading('Signing up with Google...');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    role: role, // Uses the role selected on the page
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

            toast.success('Account created successfully!', { id: toastId });
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to sign up with Google.', { id: toastId });
            console.error("Google sign-up error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Join CareerBridge" subtitle="Find your next opportunity or the perfect candidate.">
            <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
                    <input className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                    <input className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/>
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters long.</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <input className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}/>
                </div>

                <div className="mb-6">
                    <span className="block text-gray-700 text-sm font-bold mb-2">I am a:</span>
                    <div className="flex justify-around">
                        <label className={`cursor-pointer border-2 rounded-lg p-4 w-5/12 text-center transition-all duration-200 ${role === 'student' ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-300'}`}>
                            <input type="radio" name="role" value="student" className="sr-only" onChange={(e) => setRole(e.target.value)} checked={role === 'student'} />
                            <span className="font-bold text-gray-800">Student</span>
                            <p className="text-xs text-gray-500">Looking for jobs and training.</p>
                        </label>
                        <label className={`cursor-pointer border-2 rounded-lg p-4 w-5/12 text-center transition-all duration-200 ${role === 'recruiter' ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-300'}`}>
                            <input type="radio" name="role" value="recruiter" className="sr-only" onChange={(e) => setRole(e.target.value)} checked={role === 'recruiter'} />
                            <span className="font-bold text-gray-800">Recruiter</span>
                            <p className="text-xs text-gray-500">Looking to hire talent.</p>
                        </label>
                    </div>
                </div>

                <button disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md w-full disabled:bg-gray-400" type="submit">
                    {loading ? 'Creating Account...' : 'Create Account'}
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
                Sign up with Google
            </button>


            <p className="text-center text-gray-600 text-sm mt-6">
                Already have an account? <Link to="/login" className="font-bold text-teal-600 hover:text-teal-800">Log In</Link>
            </p>
        </AuthLayout>
    );
};
