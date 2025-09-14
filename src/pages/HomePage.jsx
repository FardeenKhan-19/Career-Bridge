import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BriefcaseIcon, BookOpenIcon, UserGroupIcon } from '../components/Icons.jsx';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center h-16 w-16 bg-teal-100 rounded-full mx-auto">
            {icon}
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{children}</p>
    </div>
);

export default function HomePage() {
    const { user } = useAuth();
    const heroImage = "https://static.vecteezy.com/system/resources/previews/023/659/749/non_2x/bridging-the-gap-help-or-guidance-career-advancement-giant-businessman-hands-bridge-the-gap-for-people-to-progress-towards-the-target-vector.jpg";

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-12 flex flex-col justify-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl font-extrabold text-gray-800"
                        >
                            Your Bridge to a Brighter Future
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-4 text-xl text-gray-600 max-w-2xl"
                        >
                            Connect, learn, and launch your career. We provide the training and opportunities you need to succeed.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-8 flex justify-center md:justify-start gap-4"
                        >
                            {user ? (
                                <Link to="/dashboard" className="bg-teal-600 text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-teal-700 transition-transform hover:scale-105">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="bg-teal-600 text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-teal-700 transition-transform hover:scale-105">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="bg-white text-teal-600 border-2 border-teal-600 py-3 px-8 rounded-md text-lg font-semibold hover:bg-teal-50 transition-transform hover:scale-105">
                                        Login
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                    <div className="hidden md:block">
                        <motion.img
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            src={heroImage} alt="Team collaborating" className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800">Everything You Need to Succeed</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<BriefcaseIcon className="h-8 w-8 text-teal-600" />} title="Find Your Dream Job">
                        Browse thousands of job listings from top companies and apply with a single click. Your next big opportunity is waiting.
                    </FeatureCard>
                    <FeatureCard icon={<BookOpenIcon className="h-8 w-8 text-teal-600" />} title="Upskill with Courses">
                        Enroll in expert-led courses designed to give you the in-demand skills that recruiters are looking for.
                    </FeatureCard>
                    <FeatureCard icon={<UserGroupIcon className="h-8 w-8 text-teal-600" />} title="Connect with Recruiters">
                        Build your profile and get noticed by recruiters actively hiring for roles that match your skills and ambitions.
                    </FeatureCard>
                </div>
            </section>
        </div>
    );
}

