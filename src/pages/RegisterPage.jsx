import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
                    headline: "",
                    bio: "",
                    location: "",
                    linkedinUrl: "",
                    portfolioUrl: "",
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

    return (
        <AuthLayout title="Join CareerBridge" subtitle="Find your next opportunity or the perfect candidate.">
            <form onSubmit={handleSubmit}>
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
                    {/* --- ADDED HELPER TEXT --- */}
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters long.</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <input className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}/>
                    {/* --- ADDED HELPER TEXT --- */}
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters long.</p>
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
            <p className="text-center text-gray-600 text-sm mt-6">
                Already have an account? <Link to="/login" className="font-bold text-teal-600 hover:text-teal-800">Log In</Link>
            </p>
        </AuthLayout>
    );
};

