import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from './Icons.jsx';

// This component defines the animated gradient background
const AnimatedBackground = () => (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,128,128,0.2),_transparent_40%)] -z-10 animate-pulse-slow"></div>
    </div>
);

// This is the main layout for all authentication pages
export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
            <AnimatedBackground />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="flex justify-center items-center space-x-2">
                        <Logo />
                        <span className="text-2xl font-bold text-gray-800">CareerBridge</span>
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200/50"
                >
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{title}</h2>
                    <p className="text-center text-gray-600 mb-6">{subtitle}</p>
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
