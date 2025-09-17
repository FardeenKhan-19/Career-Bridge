import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UsersIcon, BookOpenIcon, BriefcaseIcon } from '../components/Icons.jsx';

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

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, jobs: 0, courses: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const jobsSnapshot = await getDocs(collection(db, 'jobs'));
                const coursesSnapshot = await getDocs(collection(db, 'courses'));

                setStats({
                    users: usersSnapshot.size,
                    jobs: jobsSnapshot.size,
                    courses: coursesSnapshot.size,
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.uid]);

    if (loading) {
        return <div className="text-center p-10">Loading Dashboard...</div>;
    }

    return (
        <div className="w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Total Users" value={stats.users} icon={<UsersIcon />} color="bg-blue-500" />
                <StatCard title="Total Jobs" value={stats.jobs} icon={<BriefcaseIcon className="h-8 w-8 text-white" />} color="bg-purple-500" />
                <StatCard title="Total Courses" value={stats.courses} icon={<BookOpenIcon className="h-8 w-8 text-white" />} color="bg-green-500" />
            </div>

            {/* I've adjusted the grid to a 3-column layout to better fit the new card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Management</h2>
                    <p className="text-gray-600 mb-4">Create, edit, and delete courses from the library.</p>
                    <Link to="/admin/courses" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
                        Manage Courses
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resource Management</h2>
                    <p className="text-gray-600 mb-4">Create, edit, and delete helpful articles and guides.</p>
                    <Link to="/admin/resources" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                        Manage Resources
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
                    <p className="text-gray-600 mb-4">View and manage all student and recruiter accounts.</p>
                    <Link to="/admin/users" className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
                        Manage Users
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Management</h2>
                    <p className="text-gray-600 mb-4">Oversee and manage all job postings on the platform.</p>
                    <Link to="/admin/jobs" className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                        Manage Jobs
                    </Link>
                </div>

                {/* === NEW COMPANY MANAGEMENT CARD === */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Company Management</h2>
                    <p className="text-gray-600 mb-4">Add and maintain profiles for partner companies.</p>
                    <Link to="/admin/companies" className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition-colors">
                        Manage Companies
                    </Link>
                </div>
            </div>
        </div>
    );
}