export const STORAGE_KEYS = {
  USER: 'userDetailsApp_user',
  IS_AUTHENTICATED: 'userDetailsApp_isAuthenticated',
  SESSION_TIMESTAMP: 'userDetailsApp_sessionTimestamp'
};

const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000;

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const saveSession = (user) => {
  const timestamp = Date.now();
  saveToStorage(STORAGE_KEYS.USER, user);
  saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
  saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, timestamp);
};

export const getSession = () => {
  const user = getFromStorage(STORAGE_KEYS.USER);
  const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED);
  const timestamp = getFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);

  if (timestamp && Date.now() - timestamp > SESSION_EXPIRY_TIME) {
    clearSession();
    return { user: null, isAuthenticated: false, expired: true };
  }

  return { user, isAuthenticated, expired: false };
};

export const clearSession = () => {
  removeFromStorage(STORAGE_KEYS.USER);
  removeFromStorage(STORAGE_KEYS.IS_AUTHENTICATED);
  removeFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
};

export const isSessionValid = () => {
  const timestamp = getFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
  if (!timestamp) return false;

  return Date.now() - timestamp <= SESSION_EXPIRY_TIME;
};

export const refreshSession = () => {
  const user = getFromStorage(STORAGE_KEYS.USER);
  if (user && isSessionValid()) {
    saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
    return true;
  }
  return false;
};
