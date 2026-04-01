import React, { children } from 'react'
import { Navigate } from 'react-router';
import { useAuth } from '../store/authStore';

function ProtectedRoute({ children, allowedRoles }) {
    //get user login status from store
    const { loading, currentUser, isAuthenticated } = useAuth();

    //loading state
    if (loading) {
        return <p>Loading...</p>
    }

    //if user not loggedin
    if (!isAuthenticated) {
        //redirect to login
        return <Navigate to='/login' replace />
    }

    //check roles
    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        //redirect ot login
        // return <Navigate to="/unauthorized" redirectTo="/" delay="4000" />
        return <Navigate to="/register" replace />
    }

    return children
}

export default ProtectedRoute