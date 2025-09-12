import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { BriefcaseIcon } from '../components/Icons';

export default function JobDetailPage() {
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const { jobId } = useParams();

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            if (!jobId || !user) return;

            try {
                const docRef = doc(db, 'jobs', jobId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setJob({ id: docSnap.id, ...docSnap.data() });
                }

                const applicationsRef = collection(db, 'applications');
                const q = query(applicationsRef, where('jobId', '==', jobId), where('studentId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setIsApplied(true);
                }
            } catch (error) {
                console.error("Error fetching job status: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndStatus();
    }, [jobId, user]);

    const handleApply = async () => {
        // Updated to check for jobTitle instead of title
        if (!job || !job.jobTitle || !job.companyName) {
            console.error("Cannot apply, job data is incomplete:", job);
            return;
        }

        setIsApplying(true);
        try {
            await addDoc(collection(db, 'applications'), {
                jobId: jobId,
                jobTitle: job.jobTitle, // Use jobTitle here
                companyName: job.companyName,
                studentId: user.uid,
                studentName: user.displayName,
                studentEmail: user.email,
                appliedAt: serverTimestamp(),
                status: 'Applied'
            });
            setIsApplied(true);
        } catch (error) {
            console.error("Error submitting application: ", error);
        } finally {
            setIsApplying(false);
        }
    };


    if (loading) {
        return <div className="text-center p-10">Loading Job Details...</div>;
    }

    if (!job) {
        return <div className="text-center p-10">Job not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/jobs" className="text-teal-600 hover:text-teal-800 mb-6 inline-block">&larr; Back to all jobs</Link>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        {/* Use jobTitle to display the title */}
                        <h1 className="text-3xl font-bold text-gray-800">{job.jobTitle}</h1>
                        <p className="text-lg text-gray-600 mt-1">{job.companyName}</p>
                        <p className="text-md text-gray-500 mt-1">{job.location}</p>
                    </div>
                    <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">{job.jobType}</span>
                </div>
                <hr className="my-6" />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                            <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>
                <div className="mt-8 text-center">
                    <button
                        onClick={handleApply}
                        disabled={isApplied || isApplying}
                        className={`font-bold py-3 px-8 rounded-lg transition duration-300 w-full md:w-auto ${
                            isApplied
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                    >
                        {isApplying ? 'Submitting...' : isApplied ? 'Applied' : 'Apply Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

