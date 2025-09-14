import React, { useState } from 'react';
import { db } from '../firebase.js'; // Make sure this path is correct for your project
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- About Us Page ---
export function AboutUsPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About CareerBridge</h1>
            <p className="text-gray-600 mb-6">
                CareerBridge was founded on a simple mission: to seamlessly connect aspiring talent with the industry's leading opportunities. We believe that the gap between education and employment can be bridged with the right tools, training, and connections.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Our Vision</h2>
            <p className="text-gray-600 mb-6">
                We envision a world where every student has the clarity and confidence to pursue their dream career, and every company has access to a pipeline of skilled, prepared, and motivated talent. Our platform is the engine that drives this vision forward.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">What We Do</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide students with a curated list of job opportunities from top-tier companies.</li>
                <li>Offer a comprehensive library of courses to upskill and prepare for the modern workforce.</li>
                <li>Equip students with innovative tools like our AI Interview Coach to build confidence.</li>
                <li>Give recruiters a powerful platform to find and connect with the best emerging talent.</li>
            </ul>
        </div>
    );
}

// --- Contact Page --

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill out all fields.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Sending your message...');

        try {
            // This creates a new collection called 'contact_messages' if it doesn't exist
            // and adds a new document with the form data.
            await addDoc(collection(db, 'contact_messages'), {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                submittedAt: serverTimestamp(), // Records the submission time
            });

            toast.success('Message sent successfully!', { id: toastId });
            // Reset the form fields after a successful submission
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast.error('Could not send message. Please try again later.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-2xl"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
                <p className="text-gray-600 mb-8">We'd love to hear from you! Please fill out the form below.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-shadow"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-shadow"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your message..."
                            rows="5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-shadow"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-300 disabled:bg-gray-400"
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}



// --- Privacy Policy Page ---
export function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last Updated: September 12, 2025</p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, update your profile, apply for jobs, or enroll in courses. This may include your name, email address, resume details, and other professional information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
                We use the information we collect to operate, maintain, and provide you with the features and functionality of the CareerBridge platform. This includes connecting you with recruiters, personalizing course recommendations, and improving our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">3. Data Security</h2>
            <p className="text-gray-600">
                We use commercially reasonable safeguards to help keep the information collected through our service secure and take reasonable steps (such as requesting a unique password) to verify your identity before granting you access to your account.
            </p>
        </div>
    );
}
