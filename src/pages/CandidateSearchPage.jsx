import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import toast from 'react-hot-toast';

export default function CandidateSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a skill to search for.");
            return;
        }
        setLoading(true);
        setSearched(true);
        setResults([]); // Clear previous results

        try {
            const q = query(collection(db, 'users'), where('role', '==', 'student'));
            const querySnapshot = await getDocs(q);
            const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const lowercasedSearchTerm = searchTerm.toLowerCase();

            const filteredStudents = students.filter(student =>
                student.profile?.skills?.some(skill =>
                    skill.toLowerCase().includes(lowercasedSearchTerm)
                )
            );

            setResults(filteredStudents);
            if (filteredStudents.length === 0) {
                toast("No students found with that skill.", { icon: '🤷' });
            }

        } catch (error) {
            console.error("Error searching for candidates: ", error);
            toast.error("Failed to perform search.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidate Search</h1>
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by skill (e.g., React, Python)"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
                <button type="submit" disabled={loading} className="bg-teal-600 text-white font-bold py-3 px-6 rounded-md hover:bg-teal-700 disabled:bg-gray-400">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="bg-white rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-200">
                    {searched && !loading && results.length === 0 && (
                        <p className="text-center text-gray-500 p-10">No candidates found matching your criteria.</p>
                    )}
                    {results.map(student => (
                        <li key={student.id} className="p-6 flex justify-between items-center">
                            <div>
                                <p className="text-xl font-bold text-gray-800">{student.displayName}</p>
                                <p className="text-gray-600">{student.email}</p>
                                <p className="text-sm text-gray-500 mt-2">{student.profile?.headline}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-700">Skills:</p>
                                <div className="flex flex-wrap gap-2 mt-1 justify-end">
                                    {student.profile?.skills?.map((skill, index) => (
                                        <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

