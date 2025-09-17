// src/pages/CourseDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const PlayIcon = () => ( <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !courseId) return;
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const courseRef = doc(db, 'courses', courseId);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) setCourse({ id: courseSnap.id, ...courseSnap.data() });

                const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('createdAt'));
                const lessonsSnapshot = await getDocs(lessonsQuery);
                setLessons(lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                const enrollmentsRef = collection(db, 'enrollments');
                // === THE FIX IS HERE ===
                const q = query(enrollmentsRef, where("studentId", "==", user.uid), where("courseId", "==", courseId));
                const enrollmentSnap = await getDocs(q);
                if (!enrollmentSnap.empty) {
                    const enrollmentData = enrollmentSnap.docs[0].data();
                    if (enrollmentData.completedLessons) setProgress(enrollmentData.completedLessons);
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [courseId, user]);

    const progressPercentage = lessons.length > 0 ? (progress.length / lessons.length) * 100 : 0;
    if (loading) return <div className="text-center p-10">Loading Course...</div>;
    if (!course) return <div className="text-center p-10">Course not found.</div>;

    return ( <div className="bg-gray-50 min-h-screen"> <div className="container mx-auto p-4 sm:p-8"> <div className="bg-white p-8 rounded-xl shadow-md mb-8"> <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">{course.title}</h1> <p className="text-lg text-gray-600 mb-4">{course.shortDescription}</p> <div className="flex flex-wrap gap-2"> {course.tags?.map((tag, index) => ( <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">{tag}</span> ))} </div> </div> <div className="mb-8"> <div className="flex justify-between items-center mb-2"> <h2 className="text-xl font-bold text-gray-700">Your Progress</h2> <span className="font-bold text-teal-600">{Math.round(progressPercentage)}% Complete</span> </div> <div className="w-full bg-gray-200 rounded-full h-3"> <div className="bg-teal-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div> </div> </div> <div className="bg-white p-6 rounded-xl shadow-md"> <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2> <ul className="space-y-2"> {lessons.length > 0 ? ( lessons.map((lesson, index) => ( <li key={lesson.id} className="group"> <Link to={`/courses/${courseId}/lesson/${lesson.id}`} className="block p-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-100"> <div className="flex items-center justify-between"> <div className="flex items-center gap-4"> <span className="text-xl font-bold text-gray-300 group-hover:text-teal-500 transition-colors">{index + 1}</span> <PlayIcon /> <p className="font-semibold text-gray-800 text-lg">{lesson.title}</p> </div> {progress.includes(lesson.id) && ( <span className="text-green-500 font-bold flex items-center gap-2"> ✅ Completed </span> )} </div> </Link> </li> )) ) : ( <p className="p-4 text-center text-gray-500">Lessons for this course will be available soon.</p> )} </ul> </div> </div> </div> );
}