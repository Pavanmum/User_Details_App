import React, { useCallback } from 'react';
import { useUser } from '../context/UserContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useUser();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!user) return null;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Student Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {user.userName}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="profile-section">
          <h2>My Profile</h2>
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.userName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-basic-info">
                <h3>{user.userName}</h3>
                <span className="user-type-badge">Student</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h4>Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{user.language}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{user.address}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Academic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Standard:</span>
                    <span className="detail-value standard-badge">{user.standard}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Subjects</h4>
                <div className="subjects-grid">
                  {user.subjects.map((subject, index) => (
                    <div key={index} className="subject-card">
                      <span className="subject-name">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{user.subjects.length}</div>
              <div className="stat-label">Subjects</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{user.standard}</div>
              <div className="stat-label">Standard</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{user.language}</div>
              <div className="stat-label">Language</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default React.memo(StudentDashboard);
