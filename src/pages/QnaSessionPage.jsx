import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

import LiveQnaHostPage from './LiveQnaHostPage';
import LiveQnaGuestPage from './LiveQnaGuestPage';

const QnaSessionPage = () => {
    const { sessionId } = useParams();
    const { user } = useAuth();

    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionId) return;

        const fetchSession = async () => {
            try {
                const sessionRef = doc(db, 'qna_sessions', sessionId);
                const docSnap = await getDoc(sessionRef);

                if (docSnap.exists()) {
                    setSessionData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Session not found.');
                }
            } catch (err) {
                console.error("Error fetching session:", err);
                setError('Failed to load session details.');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [sessionId]);

    if (loading) {
        return <div className="text-center p-10">Loading Session...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    const isHost = user && sessionData && user.uid === sessionData.recruiterId;

    return isHost ? (
        <LiveQnaHostPage session={sessionData} />
    ) : (
        <LiveQnaGuestPage session={sessionData} />
    );
};

export default QnaSessionPage;