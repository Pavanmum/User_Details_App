import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SessionManager from './components/SessionManager';
import './App.css';

function App() {
  return (
    <UserProvider>
      <SessionManager>
        <Router>
          <div className="App">
            <Routes>
              {/* Login route */}
              <Route path="/login" element={<Login />} />

              {/* Protected dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </SessionManager>
    </UserProvider>
  );
}

export default App;
