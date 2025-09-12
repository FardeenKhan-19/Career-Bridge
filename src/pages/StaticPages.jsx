import React from 'react';

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

// --- Contact Page ---
export function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
            <p className="text-gray-600 mb-8">We'd love to hear from you! Please fill out the form below.</p>

            <form>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="John Doe" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                    <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="you@example.com" />
                </div>
                <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
                    <textarea id="message" rows="5" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Your message..."></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-700">
                        Send Message
                    </button>
                </div>
            </form>
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
