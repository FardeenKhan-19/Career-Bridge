import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusColors = {
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Interviewing': 'bg-blue-100 text-blue-800',
    'Hired': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
};

const StudentAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold">{initial}</div>;
};

const ApplicantsPage = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch job details
        const jobRef = doc(db, 'jobs', jobId);
        getDoc(jobRef).then(docSnap => {
            if (docSnap.exists()) setJob(docSnap.data());
        });

        // Listen for applicants in real-time
        const q = query(collection(db, 'applications'), where('jobId', '==', jobId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplicants(apps);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [jobId]);
    
    const handleStatusChange = async (appId, newStatus) => {
        const appRef = doc(db, 'applications', appId);
        try {
            await updateDoc(appRef, { status: newStatus });
            toast.success("Status updated successfully!");
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    if (loading) return <div className="text-center p-10">Loading Applicants...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link to="/manage-jobs" className="text-sm font-medium text-gray-600 hover:text-gray-900">&larr; Back to your jobs</Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">Applicants for {job?.jobTitle || '...'}</h1>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Change Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applicants.length > 0 ? applicants.map(app => (
                                <tr key={app.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <StudentAvatar name={app.studentName} />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                                                <div className="text-sm text-gray-500">{app.studentEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.appliedAt.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <select
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            value={app.status}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option>Under Review</option>
                                            <option>Interviewing</option>
                                            <option>Hired</option>
                                            <option>Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 py-12">No applicants for this job yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicantsPage;