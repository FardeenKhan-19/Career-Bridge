import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

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

export default function MyApplicationsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'applications'),
                    where('studentId', '==', user.uid),
                    orderBy('appliedAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(appsData);
            } catch (error) {
                console.error("Error fetching applications: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user]);

    if (loading) {
        return <div className="text-center p-10">Loading your applications...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Job Applications</h1>
            <div className="bg-white rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-200">
                    {applications.length > 0 ? applications.map(app => (
                        <li key={app.id} className="p-6 flex justify-between items-center">
                            <div>
                                <Link to={`/jobs/${app.jobId}`} className="text-xl font-bold text-teal-600 hover:underline">{app.jobTitle}</Link>
                                <p className="text-gray-600">{app.companyName}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Applied on: {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                {app.status}
                            </span>
                        </li>
                    )) : (
                        <p className="text-center text-gray-500 p-10">You have not applied to any jobs yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

