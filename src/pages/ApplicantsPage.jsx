import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

// Helper to determine the color of the status badge
const getStatusColor = (status) => {
    switch (status) {
        case 'Applied': return 'bg-blue-100 text-blue-800';
        case 'Under Review': return 'bg-yellow-100 text-yellow-800';
        case 'Interviewing': return 'bg-purple-100 text-purple-800';
        case 'Hired': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function ApplicantsPage() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');

    const fetchApplicants = async () => {
        if (!jobId) return;
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobSnap = await getDoc(jobRef);
            if (jobSnap.exists()) {
                setJobTitle(jobSnap.data().jobTitle);
            }

            const q = query(collection(db, 'applications'), where('jobId', '==', jobId));
            const querySnapshot = await getDocs(q);
            const applicantsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplicants(applicantsData);
        } catch (error) {
            console.error("Error fetching applicants: ", error);
            toast.error("Failed to load applicants.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        const docRef = doc(db, 'applications', applicationId);
        try {
            await updateDoc(docRef, { status: newStatus });
            // Refresh the list to show the updated status immediately
            fetchApplicants();
            toast.success("Applicant status updated!");
        } catch (error) {
            console.error("Error updating status: ", error);
            toast.error("Failed to update status.");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading applicants...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Link to="/manage-jobs" className="text-teal-600 hover:text-teal-800 mb-6 inline-block">&larr; Back to your jobs</Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Applicants for {jobTitle}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
                {applicants.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {applicants.map(applicant => (
                            <li key={applicant.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-lg font-semibold text-gray-800">{applicant.studentName}</p>
                                    <p className="text-gray-600">{applicant.studentEmail}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Applied on: {applicant.appliedAt ? new Date(applicant.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(applicant.status)}`}>
                                        {applicant.status}
                                    </span>
                                    <select
                                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                        defaultValue=""
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="" disabled>Change Status</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Interviewing">Interviewing</option>
                                        <option value="Hired">Hired</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">No applicants for this job yet.</p>
                )}
            </div>
        </div>
    );
}

