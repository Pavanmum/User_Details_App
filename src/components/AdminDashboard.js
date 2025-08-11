import React, { useState, useCallback, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { getAllStudents, searchStudents } from '../services/authService';
import { useDebounce } from '../hooks/useDebounce';
import UserDetailsModal from './UserDetailsModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allStudents = useMemo(() => getAllStudents(), []);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredStudents = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return allStudents;
    }
    return searchStudents(debouncedSearchQuery);
  }, [allStudents, debouncedSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDetailsClick = useCallback((student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {user?.userName}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="search-section">
          <h2>Student Management</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="search-results-count">
              {filteredStudents.length} student(s) found
            </div>
          </div>
        </div>

        <div className="students-section">
          {filteredStudents.length === 0 ? (
            <div className="no-results">
              <p>No students found matching your search criteria.</p>
            </div>
          ) : (
            <div className="students-grid">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onDetailsClick={handleDetailsClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedStudent && (
        <UserDetailsModal
          user={selectedStudent}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

const StudentCard = React.memo(({ student, onDetailsClick }) => {
  const handleClick = useCallback(() => {
    onDetailsClick(student);
  }, [student, onDetailsClick]);

  return (
    <div className="student-card">
      <div className="student-info">
        <h3 className="student-name">{student.userName}</h3>
        <p className="student-email">{student.email}</p>
        <div className="student-subjects">
          <strong>Subjects:</strong>
          <div className="subjects-list">
            {student.subjects.map((subject, index) => (
              <span key={index} className="subject-tag">
                {subject}
              </span>
            ))}
          </div>
        </div>
        <p className="student-standard">
          <strong>Standard:</strong> {student.standard}
        </p>
      </div>
      <button 
        onClick={handleClick}
        className="details-button"
      >
        Details
      </button>
    </div>
  );
});

StudentCard.displayName = 'StudentCard';

export default React.memo(AdminDashboard);
