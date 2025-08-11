import React, { useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { isSessionValid } from '../services/sessionService';

const SessionManager = ({ children }) => {
  const { isAuthenticated, logout, refreshUserSession } = useUser();

  const checkSession = useCallback(() => {
    if (isAuthenticated && !isSessionValid()) {
      logout();
      alert('Your session has expired. Please log in again.');
    }
  }, [isAuthenticated, logout]);

  const handleUserActivity = useCallback(() => {
    if (isAuthenticated) {
      refreshUserSession();
    }
  }, [isAuthenticated, refreshUserSession]);

  useEffect(() => {
    if (isAuthenticated) {
      const sessionCheckInterval = setInterval(checkSession, 60 * 1000);
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

      let activityTimeout;
      const throttledActivityHandler = () => {
        if (activityTimeout) return;
        activityTimeout = setTimeout(() => {
          handleUserActivity();
          activityTimeout = null;
        }, 30000);
      };

      activityEvents.forEach(event => {
        document.addEventListener(event, throttledActivityHandler, true);
      });

      return () => {
        clearInterval(sessionCheckInterval);
        activityEvents.forEach(event => {
          document.removeEventListener(event, throttledActivityHandler, true);
        });
        if (activityTimeout) {
          clearTimeout(activityTimeout);
        }
      };
    }
  }, [isAuthenticated, checkSession, handleUserActivity]);

  return children;
};

export default SessionManager;
