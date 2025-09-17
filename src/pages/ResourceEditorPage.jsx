// src/pages/ResourceEditorPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { toast } from 'react-hot-toast';

export default function ResourceEditorPage() {
    const [data, setData] = useState({ title: '', category: 'Article', content: '' });
    const [submitting, setSubmitting] = useState(false);
    const { resourceId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(resourceId);

    useEffect(() => {
        if (isEditMode) {
            const fetchResource = async () => {
                const docRef = doc(db, 'resources', resourceId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                } else {
                    toast.error("Resource not found.");
                    navigate('/admin/resources');
                }
            };
            fetchResource();
        }
    }, [resourceId, isEditMode, navigate]);

    const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditMode) {
                await updateDoc(doc(db, 'resources', resourceId), data);
                toast.success("Resource updated!");
            } else {
                await addDoc(collection(db, 'resources'), { ...data, createdAt: serverTimestamp() });
                toast.success("Resource created!");
            }
            navigate('/admin/resources');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Resource' : 'Create New Resource'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-6">
                <div>
                    <label htmlFor="title" className="block font-bold mb-2">Title</label>
                    <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label htmlFor="category" className="block font-bold mb-2">Category</label>
                    <select name="category" value={data.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option value="Article">Article</option>
                        <option value="Resume Guide">Resume Guide</option>
                        <option value="Interview Tips">Interview Tips</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="content" className="block font-bold mb-2">Content (Markdown supported)</label>
                    <textarea name="content" value={data.content} onChange={handleChange} rows="15" className="w-full p-2 border rounded font-mono"></textarea>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={submitting} className="bg-teal-600 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400">
                        {submitting ? 'Saving...' : 'Save Resource'}
                    </button>
                </div>
            </form>
        </div>
    );
}