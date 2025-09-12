import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CourseDetailPage() {
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const { courseId } = useParams();

    useEffect(() => {
        const fetchCourseAndStatus = async () => {
            if (!courseId || !user) return;

            try {
                // Fetch course details
                const courseRef = doc(db, 'courses', courseId);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    setCourse({ id: courseSnap.id, ...courseSnap.data() });
                }

                // Check if user is already enrolled
                const enrollmentsRef = collection(db, 'enrollments');
                const q = query(enrollmentsRef, where('courseId', '==', courseId), where('studentId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setIsEnrolled(true);
                }

            } catch (error) {
                console.error("Error fetching course and enrollment status: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndStatus();
    }, [courseId, user]);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        try {
            await addDoc(collection(db, 'enrollments'), {
                courseId: courseId,
                courseTitle: course.title,
                studentId: user.uid,
                enrolledAt: serverTimestamp(),
            });
            setIsEnrolled(true);
        } catch (error) {
            console.error("Error enrolling in course: ", error);
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading Course Details...</div>;
    }

    if (!course) {
        return <div className="text-center p-10">Course not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/courses" className="text-teal-600 hover:text-teal-800 mb-6 inline-block">&larr; Back to all courses</Link>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
                <div className="flex flex-wrap gap-2 mt-4">
                    {course.tags.map((tag, index) => (
                        <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">{tag}</span>
                    ))}
                </div>
                <hr className="my-6" />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">About this course</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{course.longDescription}</p>
                </div>
                <div className="mt-8 text-center">
                    <button
                        onClick={handleEnroll}
                        disabled={isEnrolled || isEnrolling}
                        className={`font-bold py-3 px-8 rounded-lg transition duration-300 w-full md:w-auto ${
                            isEnrolled
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                    >
                        {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

