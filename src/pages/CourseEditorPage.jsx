import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function CourseEditorPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!courseId;
    const [courseData, setCourseData] = useState({
        title: '',
        shortDescription: '',
        longDescription: '',
        tags: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        if (isEditing) {
            const fetchCourseData = async () => {
                try {
                    const docRef = doc(db, 'courses', courseId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setCourseData({ ...data, tags: data.tags.join(', ') });
                    }
                } catch (error) {
                    console.error("Failed to load course data:", error);
                    toast.error("Failed to load course data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCourseData();
        } else {
            setLoading(false);
        }
        // THE FIX: Depend on the user's stable UID, not the entire user object.
    }, [courseId, isEditing, user?.uid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading(isEditing ? 'Updating course...' : 'Creating course...');

        const finalData = {
            ...courseData,
            tags: courseData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        try {
            if (isEditing) {
                const docRef = doc(db, 'courses', courseId);
                await updateDoc(docRef, finalData);
            } else {
                await addDoc(collection(db, 'courses'), { ...finalData, createdAt: serverTimestamp() });
            }
            toast.success(`Course ${isEditing ? 'updated' : 'created'} successfully!`, { id: toastId });
            navigate('/admin/courses');
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} course.`, { id: toastId });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="text-center p-10">Loading editor...</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{isEditing ? 'Edit Course' : 'Add New Course'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Course Title</label>
                    <input type="text" name="title" value={courseData.title} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label htmlFor="shortDescription" className="block text-gray-700 font-bold mb-2">Short Description</label>
                    <input type="text" name="shortDescription" value={courseData.shortDescription} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">Tags</label>
                    <input type="text" name="tags" value={courseData.tags} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="e.g., Web Development, JavaScript" required />
                    <p className="text-xs text-gray-500 mt-1">Please provide a comma-separated list of tags.</p>
                </div>
                <div>
                    <label htmlFor="longDescription" className="block text-gray-700 font-bold mb-2">Full Course Description</label>
                    <textarea name="longDescription" value={courseData.longDescription} onChange={handleChange} rows="6" className="w-full p-2 border rounded-md" required></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" disabled={loading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Course'}
                    </button>
                </div>
            </form>
        </div>
    )
}

