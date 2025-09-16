import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import BookingModal from '../components/BookingModal';

// === AVATAR COMPONENT (TEAL THEME) ===
const CompanyAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white text-2xl font-bold shadow-md">
            {initial}
        </div>
    );
};

const JobFairDetailPage = () => {
    // ... (Saara JavaScript logic waisa hi rahega, koi badlav nahi) ...
    const { fairId } = useParams();
    const { user } = useAuth();
    const [fairDetails, setFairDetails] = useState(null);
    const [booths, setBooths] = useState([]);
    const [isParticipating, setIsParticipating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooth, setSelectedBooth] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'jobFairs', fairId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) { setError("No such job fair found!"); setLoading(false); return; }
            const fairData = { id: docSnap.id, ...docSnap.data() };
            setFairDetails(fairData);
            const boothsQuery = query(collection(db, 'booths'), where('jobFairId', '==', fairId));
            const boothsSnapshot = await getDocs(boothsQuery);
            const boothsList = boothsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooths(boothsList);
            if (user && user.role === 'recruiter') {
                const participatingIds = fairData.participatingCompanies || [];
                setIsParticipating(participatingIds.includes(user.uid));
            }
        } catch (err) { console.error("Error fetching data:", err); setError("Failed to load data."); }
        setLoading(false);
    };
    
    useEffect(() => {
        if (fairId && user) fetchAllData();
    }, [fairId, user]);

    const handleJoinFair = async () => {
        if (!user || user.role !== 'recruiter') { toast.error("Only recruiters can join a fair."); return; }
        const toastId = toast.loading('Joining fair...');
        try {
            await addDoc(collection(db, 'booths'), {
                jobFairId: fairId, companyId: user.uid, companyName: user.displayName || "A Company", availableSlots: [],
            });
            const fairDocRef = doc(db, 'jobFairs', fairId);
            await updateDoc(fairDocRef, { participatingCompanies: arrayUnion(user.uid) });
            toast.success('You have successfully joined the fair!', { id: toastId });
            fetchAllData();
        } catch (err) {
            toast.error('Failed to join the fair.', { id: toastId });
            console.error("Error joining fair:", err);
        }
    };
    
    const openModal = (booth) => { setSelectedBooth(booth); setIsModalOpen(true); };
    const closeModal = () => { setSelectedBooth(null); setIsModalOpen(false); };

    if (loading) return <div className="text-center p-10">Loading Details...</div>;
    if (error) return <div className="text-center p-10 text-red-500 font-bold">{error}</div>;


    return (
        <div className="bg-slate-50 min-h-screen">
            {fairDetails && (
                <>
                    {/* === EVENT BANNER (TEAL THEME) === */}
                    <div className="bg-gradient-to-r from-teal-50 to-green-100 p-8 sm:p-12 text-center border-b-2 border-slate-200">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-700">
                            {fairDetails.title}
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">{fairDetails.description}</p>
                        <div className="mt-6 text-sm text-slate-500">
                            <span><strong>Starts:</strong> {new Date(fairDetails.startDate.seconds * 1000).toLocaleString()}</span>
                            <span className="mx-2">|</span>
                            <span><strong>Ends:</strong> {new Date(fairDetails.endDate.seconds * 1000).toLocaleString()}</span>
                        </div>
                        {user && user.role === 'recruiter' && !isParticipating && (
                            <div className="mt-10">
                                <button onClick={handleJoinFair} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 transition-all duration-300">
                                    Join this Fair
                                </button>
                            </div>
                        )}
                        {user && user.role === 'recruiter' && isParticipating && (
                            <p className="mt-8 text-teal-600 font-semibold text-lg">✓ You are participating in this fair!</p>
                        )}
                    </div>

                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-8">Participating Company Booths</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {booths.length > 0 ? booths.map(booth => (
                                // === BOOTH CARD (TEAL THEME) ===
                                <div key={booth.id} className="bg-white p-6 rounded-xl border border-transparent hover:border-teal-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                                    <div className="flex items-center mb-4">
                                        <CompanyAvatar name={booth.companyName} />
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-slate-900">{booth.companyName}</h3>
                                            <p className="text-sm text-teal-600 font-semibold">{booth.availableSlots?.length || 0} Slots Available</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        {user && user.role === 'recruiter' && user.uid === booth.companyId && (
                                            <Link to={`/manage-booth/${booth.id}`} className="w-full text-center block bg-teal-500 text-white py-2.5 px-4 rounded-lg hover:bg-teal-600 font-semibold shadow-md transition-all">
                                                Manage Booth
                                            </Link>
                                        )}
                                        {user && user.role === 'student' && (
                                            <button onClick={() => openModal(booth)} className="w-full text-center bg-teal-500 text-white py-2.5 px-4 rounded-lg hover:bg-teal-600 font-semibold shadow-md transition-all">
                                                View & Book Slot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center text-slate-500 bg-white py-12 rounded-xl shadow-md">
                                    <p>No companies have joined this fair yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {isModalOpen && <BookingModal booth={selectedBooth} onClose={closeModal} onBookingSuccess={fetchAllData} />}
        </div>
    );
};

export default JobFairDetailPage;