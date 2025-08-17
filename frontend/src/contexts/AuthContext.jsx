import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const storedUser = localStorage.getItem('focusflame-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('focusflame-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with real user data from backend
      const userData = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0], // Use email prefix as name
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('focusflame-user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock user creation - replace with real user creation
      const userData = {
        id: `user_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('focusflame-user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('focusflame-user');
    localStorage.removeItem('focusflame-daily-tasks'); // Clear tasks on logout
    localStorage.removeItem('focusflame-timer-settings');
    localStorage.removeItem('focusflame-progress');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};