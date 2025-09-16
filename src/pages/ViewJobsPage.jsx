import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';

// --- Icons ---
const SearchIcon = () => (<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const LocationIcon = () => (<svg className="w-5 h-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);

// --- Placeholder Company Avatar ---
const CompanyAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'C';
    return (
        <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 text-2xl font-bold">
            {initial}
        </div>
    );
};

export default function ViewJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Aapka original query logic
                const q = query(collection(db, 'jobs'), where('isOpen', '==', true));
                const querySnapshot = await getDocs(q);
                const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobs(jobsData);
                setFilteredJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
            setLoading(false);
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = [...jobs];
        if (jobType !== 'All') {
            filtered = filtered.filter(job => job.jobType === jobType);
        }
        if (searchTerm) {
            filtered = filtered.filter(job => 
                job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }
        setFilteredJobs(filtered);
    }, [searchTerm, jobType, jobs]);

    if (loading) {
        return <div className="text-center p-10">Loading jobs...</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-800">Available Job Listings</h1>
                    <p className="mt-3 text-lg text-slate-500">Find your next career opportunity.</p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-20 z-10">
                    <div className="relative flex-grow w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                        <input 
                            type="text"
                            placeholder="Search by title, company, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <select 
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    >
                        <option>All</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredJobs.length > 0 ? filteredJobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-xl shadow-md border border-transparent hover:border-teal-500 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start gap-6">
                            <CompanyAvatar name={job.companyName} />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">{job.jobType}</span>
                                        <h2 className="text-xl font-bold text-gray-900 mt-2">{job.jobTitle}</h2>
                                        <p className="text-md text-gray-600">{job.companyName}</p>
                                        <p className="flex items-center text-sm text-gray-500 mt-1"><LocationIcon /> {job.location}</p>
                                    </div>
                                    <Link to={`/jobs/${job.id}`} className="hidden sm:inline-block px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">View Details</Link>
                                </div>
                                {job.skills && job.skills.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills Required:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map(skill => (
                                                <span key={skill} className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link to={`/jobs/${job.id}`} className="sm:hidden w-full mt-4 text-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">View Details</Link>
                        </div>
                    )) : (
                        <div className="text-center text-gray-500 bg-white p-12 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold">No Jobs Found</h3>
                            <p>There are no jobs matching your current search and filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}