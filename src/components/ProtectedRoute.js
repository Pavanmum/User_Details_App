import React from 'react';
import { useUser } from '../context/UserContext';
import Login from './Login';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, user } = useUser();

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default React.memo(ProtectedRoute);
