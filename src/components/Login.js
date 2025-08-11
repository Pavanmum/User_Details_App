import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { login, validateEmail, validatePassword } from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { isAuthenticated, loading, error, loginStart, loginSuccess, loginFailure, clearError } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (error) {
      clearError();
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [validationErrors, error, clearError]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      errors.password = 'Password cannot be empty';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginStart();

    try {
      const user = await login(formData.email, formData.password);
      loginSuccess(user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      loginFailure(err.message);
    }
  }, [formData, validateForm, loginStart, loginSuccess, loginFailure, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={validationErrors.email ? 'error' : ''}
              disabled={loading}
              placeholder="Enter your email"
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={validationErrors.password ? 'error' : ''}
              disabled={loading}
              placeholder="Enter your password"
            />
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          {error && (
            <div className="error-message global-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Admin:</strong> admin@school.com / admin123</p>
          <p><strong>Student:</strong> pavan.prasad@school.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
