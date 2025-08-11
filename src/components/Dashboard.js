import React from 'react';
import { useUser } from '../context/UserContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  if (user.userType === 'admin') {
    return <AdminDashboard />;
  }

  if (user.userType === 'student') {
    return <StudentDashboard />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>Unknown User Type</h2>
      <p>Unable to determine the appropriate dashboard for your account.</p>
    </div>
  );
};

export default React.memo(Dashboard);
