import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("access_token");

    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child component (Dashboard, Profile, etc.)
    return <Outlet />;
};

export default ProtectedRoute;