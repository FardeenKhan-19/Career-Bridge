import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        // We need to wait until the auth state is confirmed
        return <div className="text-center p-10">Loading...</div>;
    }

    if (user) {
        // If the user is logged in, redirect them away from this page
        return <Navigate to="/dashboard" />;
    }

    // If the user is not logged in, show the requested page (Login or Register)
    return children;
};
