import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// --- Icons (Updated to accept custom classes for color) ---
const InfoIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const BriefcaseIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const BookOpenIcon = ({ className = "h-6 w-6 text-gray-600" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> );
const ClipboardListIcon = ({ className = "h-6 w-6 text-gray-600" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> );
const ClockIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const TrendingUpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> );
const UsersIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg> );
const CalendarDaysIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /> </svg> );
const ChatIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 00-1-1H5a1 1 0 00-1 1v5l4-2 4 2 4-2V6z" /></svg> );
const QnaIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> );
const StoreIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> );
const SearchIcon = ({ className = "h-8 w-8 text-white" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );

// --- Reusable & Child Components ---
const ProfileCompletionCard = () => ( <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md mb-8" role="alert"> <div className="flex items-center"> <div className="py-1"><InfoIcon/></div> <div className="ml-4"> <p className="font-bold">Complete Your Profile!</p> <p className="text-sm">A complete profile increases your visibility to recruiters. Let's get it done.</p> </div> <Link to="/profile" className="ml-auto bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"> Go to Profile </Link> </div> </div> );
const StatCard = ({ title, value, icon, color }) => ( <div className={`p-6 rounded-lg shadow-lg text-white ${color}`}> <div className="flex justify-between items-center"> <div> <p className="text-lg font-semibold">{title}</p> <p className="text-3xl font-bold">{value}</p> </div> <div className="bg-white/20 p-3 rounded-full"> {icon} </div> </div> </div> );
const ActionStatCard = ({ title, icon, color }) => ( <div className={`p-6 h-full rounded-lg shadow-lg text-white ${color} flex flex-col items-center justify-center text-center`}> <div className="bg-white/20 p-4 rounded-full mb-3">{icon}</div> <p className="text-lg font-bold">{title}</p> </div> );
const CircularProgressBar = ({ progress }) => { const size = 120; const strokeWidth = 10; const radius = (size - strokeWidth) / 2; const circumference = radius * 2 * Math.PI; const offset = circumference - (progress / 100) * circumference; return ( <div className="relative flex flex-col items-center justify-center"> <svg width={size} height={size} className="transform -rotate-90"> <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="transparent" /> <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke="#14b8a6" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "easeInOut" }} /> </svg> <div className="absolute flex flex-col items-center"> <span className="text-2xl font-bold text-gray-700">{`${Math.round(progress)}%`}</span> <span className="text-xs text-gray-500">Complete</span> </div> </div> ); };

// --- Student Dashboard ---
const StudentDashboard = () => {
    const { user } = useAuth();
    const [recentActivity, setRecentActivity] = useState([]);
    const [profileStrength, setProfileStrength] = useState(0);
    useEffect(() => { if (!user?.uid) return; const calculateProfileStrength = () => { if (!user.profile) return; const fields = ['headline', 'bio', 'linkedinUrl', 'portfolioUrl']; let completedFields = 0; fields.forEach(field => { if (user.profile[field]) completedFields++; }); if (user.profile.skills && user.profile.skills.length > 0) completedFields++; const strength = Math.round((completedFields / (fields.length + 1)) * 100); setProfileStrength(strength); }; const fetchRecentActivity = async () => { try { const appsQuery = query(collection(db, 'applications'), where('studentId', '==', user.uid), orderBy('appliedAt', 'desc'), limit(2)); const enrollQuery = query(collection(db, 'enrollments'), where('studentId', '==', user.uid), orderBy('enrolledAt', 'desc'), limit(2)); const [appSnapshot, enrollSnapshot] = await Promise.all([getDocs(appsQuery), getDocs(enrollQuery)]); const apps = appSnapshot.docs.map(doc => ({ type: 'application', ...doc.data() })); const enrolls = enrollSnapshot.docs.map(doc => ({ type: 'enrollment', ...doc.data() })); const combined = [...apps, ...enrolls].sort((a, b) => { const dateA = a.appliedAt || a.enrolledAt; const dateB = b.appliedAt || b.enrolledAt; if (dateA && dateB) { return dateB.seconds - dateA.seconds; } return 0; }); setRecentActivity(combined.slice(0, 4)); } catch (error) { console.error("Error fetching recent activity:", error); } }; calculateProfileStrength(); fetchRecentActivity(); }, [user]);
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName}!</h1>
                {user?.isProfileComplete === false && <ProfileCompletionCard />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Link to="/jobs" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><BriefcaseIcon className="h-6 w-6 text-gray-600"/><div><h3 className="font-bold text-lg text-gray-800">Browse Jobs</h3><p className="text-gray-600">Find open positions.</p></div></Link>
                    <Link to="/my-applications" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><ClipboardListIcon /><div><h3 className="font-bold text-lg text-gray-800">My Applications</h3><p className="text-gray-600">Track your status.</p></div></Link>
                    <Link to="/my-courses" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><BookOpenIcon /><div><h3 className="font-bold text-lg text-gray-800">My Courses</h3><p className="text-gray-600">View enrolled courses.</p></div></Link>
                    <Link to="/job-fairs" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><CalendarDaysIcon className="h-6 w-6 text-gray-600"/><div><h3 className="font-bold text-lg text-gray-800">Virtual Job Fairs</h3><p className="text-gray-600">Explore live hiring events.</p></div></Link>
                    <Link to="/my-scheduled-interviews" className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><ClockIcon className="h-6 w-6 text-gray-600"/><div><h3 className="font-bold text-lg text-gray-800">My Scheduled Interviews</h3><p className="text-gray-600">View your bookings.</p></div></Link>
                </div>
            </div>
            <div className="space-y-8"> <div><h2 className="text-xl font-bold text-gray-800 mb-4">Profile Strength</h2><div className="bg-white p-6 rounded-lg shadow-md text-center"><CircularProgressBar progress={profileStrength} /><Link to="/profile" className="mt-4 inline-block text-teal-600 hover:underline font-semibold">Complete Your Profile</Link></div></div> <div><h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2><div className="bg-white p-6 rounded-lg shadow-md space-y-4">{recentActivity.length > 0 ? recentActivity.map((activity, i) => ( <div key={i} className="flex items-center gap-4"><ClockIcon className="h-5 w-5 text-gray-400"/><div><p className="font-semibold text-gray-700">{activity.type === 'application' ? `Applied to ${activity.jobTitle}` : `Enrolled in ${activity.courseTitle}`}</p><p className="text-xs text-gray-500">{new Date((activity.appliedAt || activity.enrolledAt).seconds * 1000).toLocaleDateString()}</p></div></div> )) : <p className="text-gray-500">No recent activity.</p>}</div></div> </div>
        </div>
    );
};

// --- Recruiter Dashboard ---
const RecruiterDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
    const [recentApplicants, setRecentApplicants] = useState([]);
    useEffect(() => { if (!user?.uid) return; const fetchDashboardData = async () => { try { const jobsQuery = query(collection(db, 'jobs'), where('recruiterId', '==', user.uid)); const jobsSnapshot = await getDocs(jobsQuery); const jobsData = jobsSnapshot.docs.map(doc => doc.id); let applicantsCount = 0; let allApplicants = []; if (jobsData.length > 0) { const appsQuery = query(collection(db, 'applications'), where('jobId', 'in', jobsData), orderBy('appliedAt', 'desc'), limit(5)); const appsSnapshot = await getDocs(appsQuery); allApplicants = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); const totalAppsQuery = query(collection(db, 'applications'), where('jobId', 'in', jobsData)); const totalAppsSnapshot = await getDocs(totalAppsQuery); applicantsCount = totalAppsSnapshot.size; } setStats({ jobs: jobsData.length, applicants: applicantsCount }); setRecentApplicants(allApplicants); } catch (error) { console.error("Error fetching recruiter data:", error); } }; fetchDashboardData(); }, [user?.uid]);
    const handleStartChat = async (applicant) => { if (!user || !applicant.studentId) return toast.error("Applicant details are missing."); const toastId = toast.loading("Starting chat..."); try { const chatsRef = collection(db, 'chats'); const q = query(chatsRef, where('participants', 'array-contains', user.uid)); const querySnapshot = await getDocs(q); let existingChat = null; querySnapshot.forEach(doc => { const chat = doc.data(); if (chat.participants.includes(applicant.studentId)) { existingChat = { id: doc.id, ...chat }; } }); if (existingChat) { toast.success("Chat found!", { id: toastId }); navigate(`/chat/${existingChat.id}`); } else { const newChatRef = await addDoc(chatsRef, { participants: [user.uid, applicant.studentId], participantInfo: [ { uid: user.uid, name: user.displayName }, { uid: applicant.studentId, name: applicant.studentName } ], updatedAt: serverTimestamp(), lastMessage: null }); toast.success("New chat created!", { id: toastId }); navigate(`/chat/${newChatRef.id}`); } } catch (error) { toast.error("Could not start chat.", { id: toastId }); console.error("Error starting chat:", error); } };
    
    return (
        <div className="w-full space-y-8">
            <div><h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName}!</h1>{user?.isProfileComplete === false && <ProfileCompletionCard />}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Link to="/manage-jobs" className="hover:scale-105 transition-transform"><StatCard title="Jobs Posted" value={stats.jobs} icon={<TrendingUpIcon />} color="bg-teal-500" /></Link><Link to="/manage-jobs" className="hover:scale-105 transition-transform"><StatCard title="Total Applicants" value={stats.applicants} icon={<UsersIcon />} color="bg-blue-500" /></Link></div>
            
            {/* === SIRF RECRUITER KE IN 6 CARDS KO UPDATE KIYA GAYA HAI (Aapka structure waisa hi hai) === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Link to="/post-job" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="Post a New Job" icon={<BriefcaseIcon />} color="bg-indigo-500" />
                </Link>
                <Link to="/job-fairs" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="View Job Fairs" icon={<StoreIcon />} color="bg-purple-500" />
                </Link>
                <Link to="/create-job-fair" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="Create a Job Fair" icon={<CalendarDaysIcon />} color="bg-pink-500" />
                </Link>
                <Link to="/my-appointments" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="View Appointments" icon={<ClockIcon />} color="bg-sky-500" />
                </Link>
                <Link to="/create-qna" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="Schedule Q&A" icon={<QnaIcon />} color="bg-amber-500" />
                </Link>
                <Link to="/candidate-search" className="hover:scale-105 transition-transform">
                    <ActionStatCard title="Search Candidates" icon={<SearchIcon />} color="bg-rose-500" />
                </Link>
            </div>
            
            <div>
                 {/* === Aapka Recent Applicants section waise ka waisa hai === */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applicants</h2>
                <div className="bg-white rounded-lg shadow-md">
                    <ul className="divide-y divide-gray-200">
                        {recentApplicants.length > 0 ? recentApplicants.map((app) => (
                            <li key={app.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                <div><p className="font-semibold text-gray-800">{app.studentName}</p><p className="text-sm text-gray-500">Applied for: <Link to={`/jobs/${app.jobId}/applicants`} className="font-medium text-teal-600 hover:underline">{app.jobTitle}</Link></p></div>
                                <div className="flex items-center space-x-4"><p className="text-sm text-gray-500 hidden sm:block">{new Date(app.appliedAt.seconds * 1000).toLocaleDateString()}</p><button onClick={() => handleStartChat(app)} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 flex items-center space-x-2 transition-colors"><ChatIcon /><span>Chat</span></button></div>
                            </li>
                        )) : <p className="text-center text-gray-500 p-6">No recent applicants.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Main DashboardPage Component ---
export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    if (user?.role === 'student') {
        return <StudentDashboard />;
    }

    if (user?.role === 'recruiter') {
        return <RecruiterDashboard />;
    }

    return <Navigate to="/login" />;
}
/* */