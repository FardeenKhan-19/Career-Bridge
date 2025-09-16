import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, doc, deleteDoc, where, writeBatch } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// --- Icons for the page ---
const CalendarIcon = () => (<svg className="w-5 h-5 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const TrashIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const QnaIcon = () => (<svg className="w-5 h-5 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);

const ViewJobFairsPage = () => {
    const { user } = useAuth();
    const [jobFairs, setJobFairs] = useState([]);
    const [qnaSessions, setQnaSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Aapka original, working data fetching logic
    const fetchJobFairs = async () => {
        try {
            const fairsCollection = collection(db, 'jobFairs');
            const q = query(fairsCollection, orderBy('startDate', 'asc'));
            const fairSnapshot = await getDocs(q);
            const fairsList = fairSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJobFairs(fairsList);
        } catch (err) {
            console.error("Error fetching job fairs:", err);
            toast.error('Failed to load job fairs.');
        }
    };

    const fetchQnaSessions = async () => {
        try {
            const qnaCollection = collection(db, 'qna_sessions');
            const q = query(qnaCollection, where('status', '==', 'scheduled'), orderBy('scheduledTime', 'asc'));
            const qnaSnapshot = await getDocs(q);
            const sessionsList = qnaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQnaSessions(sessionsList);
        } catch (err) {
            console.error("Error fetching Q&A sessions:", err);
            toast.error('Failed to load upcoming Q&A sessions.');
        }
    };

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            await Promise.all([fetchJobFairs(), fetchQnaSessions()]);
            setLoading(false);
        };
        loadAllData();
    }, []);

    const handleDelete = (fairId) => {
        // Aapka original, working delete logic
        Swal.fire({
            title: 'Are you sure?', text: "This will delete the fair and ALL its booths and appointments!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes, delete everything!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const toastId = toast.loading("Deleting fair and all related data...");
                try {
                    const batch = writeBatch(db);
                    const boothsQuery = query(collection(db, 'booths'), where('jobFairId', '==', fairId));
                    const boothsSnapshot = await getDocs(boothsQuery);
                    boothsSnapshot.forEach(doc => { batch.delete(doc.ref); });
                    const appointmentsQuery = query(collection(db, 'appointments'), where('jobFairId', '==', fairId));
                    const appointmentsSnapshot = await getDocs(appointmentsQuery);
                    appointmentsSnapshot.forEach(doc => { batch.delete(doc.ref); });
                    batch.delete(doc(db, "jobFairs", fairId));
                    await batch.commit();
                    toast.success("Cleanup successful!", { id: toastId });
                    fetchJobFairs();
                } catch (error) {
                    toast.error("Cleanup failed. See console for details.", { id: toastId });
                    console.error("Error during cascading delete:", error);
                }
            }
        });
    };

    const getStatus = (startDate, endDate) => {
        const now = new Date();
        const start = startDate.toDate();
        const end = endDate.toDate();
        if (now < start) return { text: "Upcoming", color: "bg-blue-100 text-blue-800" };
        if (now >= start && now <= end) return { text: "Live", color: "bg-red-100 text-red-800 animate-pulse" };
        return { text: "Finished", color: "bg-gray-100 text-gray-800" };
    };
    
    if (loading) return <div className="text-center p-10">Loading Events...</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* --- Job Fairs Section --- */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Virtual Job Fairs</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500">Explore live events and connect with companies.</p>
                </div>
                {jobFairs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobFairs.map(fair => {
                            const status = getStatus(fair.startDate, fair.endDate);
                            return (
                                // === JOB FAIR CARD KA NAYA DESIGN ===
                                <div key={fair.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border-t-4 border-transparent hover:border-teal-500 transform hover:-translate-y-1">
                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start"><h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{fair.title}</h2><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span></div>
                                        <div className="text-sm text-gray-600 space-y-2 mt-2"><p className="flex items-center"><CalendarIcon /> <span>{fair.startDate.toDate().toLocaleString()}</span></p><p className="flex items-center"><CalendarIcon /> <span>{fair.endDate.toDate().toLocaleString()}</span></p></div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center mt-auto"><Link to={`/job-fair/${fair.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-800">View Details &rarr;</Link>{user && user.uid === fair.organizerId && (<button onClick={() => handleDelete(fair.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"><TrashIcon /></button>)}</div>
                                </div>);
                        })}
                    </div>
                ) : (<p className="text-center text-gray-500 mt-10">No job fairs scheduled at the moment.</p>)}

                {/* --- Q&A Section --- */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upcoming Q&A Sessions</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">Ask your questions directly to the recruiters.</p>
                    </div>
                    {qnaSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {qnaSessions.map(session => (
                                // === Q&A CARD KA NAYA DESIGN ===
                                <div key={session.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border-t-4 border-transparent hover:border-indigo-500 transform hover:-translate-y-1">
                                    <div className="p-6 flex-grow">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">Scheduled</span>
                                        <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2 truncate">{session.topic}</h3>
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <p className="flex items-center"><QnaIcon /> <strong>Host:</strong> &nbsp;{session.recruiterName}</p>
                                            <p className="flex items-center"><CalendarIcon /> <strong>Live on:</strong> &nbsp;{session.scheduledTime.toDate().toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 mt-auto">
                                        <Link to={`/qna-session/${session.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View Session &rarr;</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : ( <p className="text-center text-gray-500 mt-10">No Q&A sessions scheduled at the moment.</p> )}
                </div>
            </div>
        </div>
    );
};
export default ViewJobFairsPage;
/* */