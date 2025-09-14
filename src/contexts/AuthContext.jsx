import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUser({ ...firebaseUser, ...userDoc.data() });
                    } else {
                        // This might happen briefly during registration
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(firebaseUser); // Fallback to basic user info
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // This useMemo hook is the critical fix.
    // It ensures that the 'value' object passed to the provider
    // only changes when the user or loading state actually changes.
    // This prevents the infinite loop.
    const value = useMemo(() => ({
        user,
        loading,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

