import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

// Toggle Switch Component
const Toggle = ({ enabled, onChange }) => (
    <div
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
            enabled ? 'bg-teal-600' : 'bg-gray-300'
        }`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </div>
);

export default function ManageJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, 'jobs'), where('recruiterId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJobs(jobsData);
        } catch(e) {
            toast.error("Could not fetch your jobs.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [user]);

    const handleStatusToggle = async (jobId, currentStatus) => {
        const docRef = doc(db, 'jobs', jobId);
        try {
            await updateDoc(docRef, { isOpen: !currentStatus });
            // Refresh the list to show the change
            fetchJobs();
            toast.success(`Job marked as ${!currentStatus ? 'Open' : 'Closed'}.`);
        } catch (error) {
            toast.error("Failed to update job status.");
            console.error(error);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your jobs...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Your Job Postings</h1>
            <div className="space-y-6">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{job.jobTitle}</h2>
                                <p className="text-gray-600">{job.location}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${job.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {job.isOpen ? 'Open' : 'Closed'}
                                </span>
                                <Toggle enabled={job.isOpen} onChange={() => handleStatusToggle(job.id, job.isOpen)} />
                            </div>
                        </div>
                        <div className="text-right mt-4 flex justify-end gap-4">
                            <Link to={`/edit-job/${job.id}`} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">
                                Edit
                            </Link>
                            <Link to={`/jobs/${job.id}/applicants`} className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300">
                                View Applicants
                            </Link>
                        </div>
                    </div>
                )) : (
                    <p>You have not posted any jobs yet.</p>
                )}
            </div>
        </div>
    );
}

