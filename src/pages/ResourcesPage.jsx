// src/pages/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';
import { motion } from 'framer-motion';

// --- Icon Components ---
const ResumeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const InterviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" /></svg>;
const ArticleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>;

const categoryStyles = {
    'Resume Guide': { icon: <ResumeIcon />, color: 'bg-indigo-100 text-indigo-800' },
    'Interview Tips': { icon: <InterviewIcon />, color: 'bg-sky-100 text-sky-800' },
    'Article': { icon: <ArticleIcon />, color: 'bg-emerald-100 text-emerald-800' },
};

const ResourceCard = ({ resource }) => {
    const style = categoryStyles[resource.category] || categoryStyles['Article'];
    return (
        <motion.div whileHover={{ y: -5 }} className="flex flex-col">
            <Link to={`/resources/${resource.id}`} className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 h-full overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        {style.icon}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.color}`}>{resource.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 line-clamp-3 flex-grow">{resource.content.substring(0, 120)}...</p>
                </div>
                <div className="bg-gray-50 px-6 py-3 mt-4">
                    <span className="font-semibold text-teal-600 hover:text-teal-700">Read More &rarr;</span>
                </div>
            </Link>
        </motion.div>
    );
};

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Resume Guide', 'Interview Tips', 'Article'];

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            setResources(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchResources();
    }, []);

    const filteredResources = activeCategory === 'All'
        ? resources
        : resources.filter(r => r.category === activeCategory);

    if (loading) return <div className="text-center p-10">Loading Resources...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Resource Library</h1>
                <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">Your one-stop destination for career-enhancing guides, tips, and articles.</p>
            </div>

            <div className="flex justify-center mb-10 bg-white p-2 rounded-lg shadow-sm max-w-md mx-auto">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-center px-4 py-2 font-semibold rounded-md transition-colors ${activeCategory === category ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
            {filteredResources.length === 0 && <p className="text-center text-gray-500 col-span-full mt-8">No resources found in this category yet.</p>}
        </div>
    );
}