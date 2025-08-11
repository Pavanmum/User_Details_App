import React, { useCallback, useEffect } from 'react';
import './UserDetailsModal.css';

const UserDetailsModal = ({ user, onClose }) => {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!user) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>User Details</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.userName}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">User Type:</span>
              <span className={`detail-value user-type ${user.userType}`}>
                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Language:</span>
              <span className="detail-value">{user.language}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user.address}</span>
            </div>
            
            {user.userType === 'student' && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Standard:</span>
                  <span className="detail-value">{user.standard}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Subjects:</span>
                  <div className="subjects-container">
                    {user.subjects.map((subject, index) => (
                      <span key={index} className="subject-badge">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="close-modal-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserDetailsModal);
