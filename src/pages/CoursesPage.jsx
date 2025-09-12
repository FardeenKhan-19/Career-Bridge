import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { BookOpenIcon } from '../components/Icons.jsx';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(coursesData);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading courses...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length > 0 ? courses.map(course => (
                    <Link to={`/courses/${course.id}`} key={course.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                        <p className="text-gray-600 mt-2">{course.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {course.tags.map((tag, index) => (
                                <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
                            ))}
                        </div>
                    </Link>
                )) : (
                    <p>No courses available at the moment.</p>
                )}
            </div>
        </div>
    );
}

