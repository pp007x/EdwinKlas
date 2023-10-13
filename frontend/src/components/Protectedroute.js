// ProtectedComponent.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function ProtectedComponent({children}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" />
    }

    const decodedToken = jwtDecode(token);
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (userRole !== 'Admin' && userRole !== 'Mod') {
        return <Navigate to="/home" />
    }

    return children;
}

export default ProtectedComponent;
