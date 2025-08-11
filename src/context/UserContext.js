import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { saveSession, getSession, clearSession, refreshSession } from '../services/sessionService';

const getInitialState = () => {
  const { user, isAuthenticated } = getSession();

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    loading: false,
    error: null
  };
};

const initialState = getInitialState();

const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

const userReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionTypes.LOGIN_SUCCESS:
      saveSession(action.payload);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case ActionTypes.LOGOUT:
      clearSession();
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case ActionTypes.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const { user, isAuthenticated, expired } = getSession();

    if (expired) {
      dispatch({ type: ActionTypes.LOGOUT });
    } else if (user && isAuthenticated) {
      dispatch({
        type: ActionTypes.RESTORE_SESSION,
        payload: {
          user,
          isAuthenticated
        }
      });
    }
  }, []);

  const loginStart = useCallback(() => {
    dispatch({ type: ActionTypes.LOGIN_START });
  }, []);

  const loginSuccess = useCallback((user) => {
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
  }, []);

  const loginFailure = useCallback((error) => {
    dispatch({ type: ActionTypes.LOGIN_FAILURE, payload: error });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: ActionTypes.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  const refreshUserSession = useCallback(() => {
    if (state.isAuthenticated) {
      refreshSession();
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        refreshUserSession();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, refreshUserSession]);

  const value = {
    ...state,
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    refreshUserSession
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
