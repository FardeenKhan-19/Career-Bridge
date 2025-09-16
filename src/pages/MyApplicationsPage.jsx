import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// --- Status ke liye colors ---
const statusColors = {
    'Applied': 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Interviewing': 'bg-blue-100 text-blue-800',
    'Hired': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
};

// --- Placeholder Company Avatar ---
const CompanyAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'C';
    return (
        <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 text-2xl font-bold">
            {initial}
        </div>
    );
};

const MyApplicationsPage = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'applications'),
            where('studentId', '==', user.uid),
            orderBy('appliedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(appsData);
            setFilteredApps(appsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredApps(applications);
        } else {
            setFilteredApps(applications.filter(app => app.status === filter));
        }
    }, [filter, applications]);

    if (loading) {
        return <div className="text-center p-10">Loading your applications...</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-800">My Job Applications</h1>
                    <p className="mt-3 text-lg text-slate-500">Track the status of all your job applications here.</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-center space-x-2 mb-8">
                    {['All', 'Under Review', 'Interviewing', 'Hired', 'Rejected'].map(status => (
                        <button 
                            key={status} 
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === status ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                
                <div className="space-y-6">
                    {filteredApps.length > 0 ? filteredApps.map(app => (
                        <div key={app.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col sm:flex-row items-start gap-6">
                           <CompanyAvatar name={app.companyName} />
                           <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{app.jobTitle}</h2>
                                        <p className="text-md text-gray-600">{app.companyName}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Applied on: {app.appliedAt?.toDate().toLocaleDateString()}
                                </p>
                           </div>
                           <Link to={`/jobs/${app.jobId}`} className="w-full sm:w-auto mt-4 sm:mt-0 text-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                View Job
                            </Link>
                        </div>
                    )) : (
                        <div className="text-center text-gray-500 bg-white p-12 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold">No Applications Found</h3>
                            <p className="mt-2">You have not applied for any jobs yet, or no applications match the current filter.</p>
                             <Link to="/jobs" className="mt-6 inline-block bg-teal-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-teal-700">
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplicationsPage;