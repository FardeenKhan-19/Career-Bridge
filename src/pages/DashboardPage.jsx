import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import {
    InfoIcon, BriefcaseIcon, BookOpenIcon, UserCircleIcon, ChatBubbleIcon,
    ClipboardListIcon, ClockIcon, TrendingUpIcon, UsersIcon,
    DocumentAnalyticsIcon // 1. Import the new, corrected icon
} from '../components/Icons.jsx';

// --- Reusable Components ---
const ProfileCompletionCard = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md mb-8" role="alert">
        <div className="flex items-center">
            <div className="py-1"><InfoIcon/></div>
            <div className="ml-4">
                <p className="font-bold">Complete Your Profile!</p>
                <p className="text-sm">A complete profile increases your visibility to recruiters. Let's get it done.</p>
            </div>
            <Link to="/profile" className="ml-auto bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300">
                Go to Profile
            </Link>
        </div>
    </div>
);

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-lg text-white ${color}`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

// --- Student Dashboard ---
const StudentDashboard = () => {
    const { user } = useAuth();
    const [recentActivity, setRecentActivity] = useState([]);
    const [profileStrength, setProfileStrength] = useState(0);

    useEffect(() => {
        const calculateProfileStrength = () => {
            if (!user?.profile) return 0;
            const fields = ['headline', 'bio', 'linkedinUrl', 'portfolioUrl'];
            let completedFields = 0;
            fields.forEach(field => {
                if (user.profile[field]) completedFields++;
            });
            if (user.profile.skills && user.profile.skills.length > 0) completedFields++;
            const strength = Math.round((completedFields / (fields.length + 1)) * 100);
            setProfileStrength(strength);
        };

        const fetchRecentActivity = async () => {
            if (!user) return;
            try {
                const appsQuery = query(collection(db, 'applications'), where('studentId', '==', user.uid), orderBy('appliedAt', 'desc'), limit(2));
                const enrollQuery = query(collection(db, 'enrollments'), where('studentId', '==', user.uid), orderBy('enrolledAt', 'desc'), limit(2));
                const [appSnapshot, enrollSnapshot] = await Promise.all([getDocs(appsQuery), getDocs(enrollQuery)]);
                const apps = appSnapshot.docs.map(doc => ({ type: 'application', ...doc.data() }));
                const enrolls = enrollSnapshot.docs.map(doc => ({ type: 'enrollment', ...doc.data() }));
                const combined = [...apps, ...enrolls].sort((a, b) => {
                    const dateA = a.appliedAt || a.enrolledAt;
                    const dateB = b.appliedAt || b.enrolledAt;
                    return dateB.seconds - dateA.seconds;
                });
                setRecentActivity(combined.slice(0, 4));
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            }
        };

        calculateProfileStrength();
        fetchRecentActivity();
    }, [user]);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName}!</h1>
                {!user?.isProfileComplete && <ProfileCompletionCard />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Link to="/jobs" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><BriefcaseIcon /><div><h3 className="font-bold text-lg text-gray-800">Browse Jobs</h3><p className="text-gray-600">Find open positions.</p></div></Link>
                    <Link to="/my-applications" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><ClipboardListIcon /><div><h3 className="font-bold text-lg text-gray-800">My Applications</h3><p className="text-gray-600">Track your status.</p></div></Link>
                    <Link to="/courses" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><BookOpenIcon /><div><h3 className="font-bold text-lg text-gray-800">Browse Courses</h3><p className="text-gray-600">Upskill your talent.</p></div></Link>
                    <Link to="/my-courses" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><BookOpenIcon /><div><h3 className="font-bold text-lg text-gray-800">My Courses</h3><p className="text-gray-600">View enrolled courses.</p></div></Link>
                    <Link to="/interview-coach" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><ChatBubbleIcon /><div><h3 className="font-bold text-lg text-gray-800">AI Interview Coach</h3><p className="text-gray-600">Practice your skills.</p></div></Link>
                    
                    {/* --- THIS IS THE CORRECTED SECTION --- */}
                    <Link to="/resume-scanner" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                        {/* 2. Use the new icon. It will now have the correct default size and color. */}
                        <DocumentAnalyticsIcon />
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">AI Resume Scanner</h3>
                            <p className="text-gray-600">Get instant analysis.</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Strength</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-teal-600 h-4 rounded-full" style={{ width: `${profileStrength}%` }}></div>
                        </div>
                        <p className="text-center mt-2 text-gray-600">{profileStrength}% Complete</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <ClockIcon />
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        {activity.type === 'application' ? `Applied to ${activity.jobTitle}` : `Enrolled in ${activity.courseTitle}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date((activity.appliedAt || activity.enrolledAt).seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No recent activity.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Recruiter Dashboard ---
const RecruiterDashboard = () => {
    // ... (No changes to this component)
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
    const [recentApplicants, setRecentApplicants] = useState([]);
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const jobsQuery = query(collection(db, 'jobs'), where('recruiterId', '==', user.uid));
                const jobsSnapshot = await getDocs(jobsQuery);
                const jobsData = jobsSnapshot.docs.map(doc => doc.id);
                let applicantsCount = 0;
                let allApplicants = [];
                if (jobsData.length > 0) {
                    const appsQuery = query(collection(db, 'applications'), where('jobId', 'in', jobsData), orderBy('appliedAt', 'desc'), limit(5));
                    const appsSnapshot = await getDocs(appsQuery);
                    allApplicants = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const totalAppsQuery = query(collection(db, 'applications'), where('jobId', 'in', jobsData));
                    const totalAppsSnapshot = await getDocs(totalAppsQuery);
                    applicantsCount = totalAppsSnapshot.size;
                }
                setStats({ jobs: jobsData.length, applicants: applicantsCount });
                setRecentApplicants(allApplicants);
            } catch (error) {
                console.error("Error fetching recruiter data:", error);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName}!</h1>
                {!user?.isProfileComplete && <ProfileCompletionCard />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/manage-jobs" className="hover:scale-105 transition-transform"><StatCard title="Jobs Posted" value={stats.jobs} icon={<TrendingUpIcon />} color="bg-teal-500" /></Link>
                <Link to="/manage-jobs" className="hover:scale-105 transition-transform"><StatCard title="Total Applicants" value={stats.applicants} icon={<UsersIcon />} color="bg-blue-500" /></Link>
                <Link to="/post-job" className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center items-center hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-200 p-3 rounded-full mb-2">
                        <BriefcaseIcon />
                    </div>
                    <p className="font-bold text-lg text-gray-800">Post a New Job</p>
                </Link>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applicants</h2>
                <div className="bg-white rounded-lg shadow-md">
                    <ul className="divide-y divide-gray-200">
                        {recentApplicants.length > 0 ? recentApplicants.map((app) => (
                            <Link to={`/jobs/${app.jobId}/applicants`} key={app.id} className="block p-4 hover:bg-gray-50 transition-colors">
                                <li className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{app.studentName}</p>
                                        <p className="text-sm text-gray-500">Applied for: <span className="font-medium text-teal-600">{app.jobTitle}</span></p>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(app.appliedAt.seconds * 1000).toLocaleDateString()}</p>
                                </li>
                            </Link>
                        )) : <p className="text-center text-gray-500 p-6">No recent applicants.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default function DashboardPage() {
    const { user, loading } = useAuth();
    if (loading) { return <div className="text-center p-10">Loading dashboard...</div>; }
    if (user?.role === 'student') { return <StudentDashboard />; }
    if (user?.role === 'recruiter') { return <RecruiterDashboard />; }
    return <div className="text-center p-10">Loading...</div>;
}
        