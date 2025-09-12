import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BookOpenIcon } from '../components/Icons.jsx';

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, 'enrollments'), where('studentId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const enrolledCourses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEnrollments(enrolledCourses);
            } catch (error) {
                console.error("Error fetching enrollments: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [user]);

    if (loading) {
        return <div className="text-center p-10">Loading your courses...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Enrolled Courses</h1>
            <div className="space-y-6">
                {enrollments.length > 0 ? enrollments.map(enrollment => (
                    <div key={enrollment.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{enrollment.courseTitle}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enrolled on: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <Link
                                to={`/courses/${enrollment.courseId}`}
                                className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
                            >
                                Go to Course
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
                        <p className="mt-1 text-sm text-gray-500">You have not enrolled in any courses.</p>
                        <div className="mt-6">
                            <Link to="/courses" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

