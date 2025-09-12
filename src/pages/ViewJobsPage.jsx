import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { BriefcaseIcon } from '../components/Icons.jsx';

export default function ViewJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(collection(db, 'jobs'), where('isOpen', '==', true));
                const querySnapshot = await getDocs(q);
                const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading jobs...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Job Listings</h1>
            <div className="space-y-6">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{job.jobTitle}</h2>
                                <p className="text-gray-600">{job.companyName}</p>
                                <p className="text-sm text-gray-500 mt-1">{job.location} &bull; {job.jobType}</p>
                            </div>
                            <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{job.jobType}</span>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold text-sm text-gray-700">Skills Required:</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right mt-4">
                            <Link to={`/jobs/${job.id}`} className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300">
                                View Details
                            </Link>
                        </div>
                    </div>
                )) : (
                    <p>No job listings available at the moment.</p>
                )}
            </div>
        </div>
    );
}

