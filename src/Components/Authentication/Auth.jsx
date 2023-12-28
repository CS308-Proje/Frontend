import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true); // Add a loading state
  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoggedIn) {
        setLoading(true); // Begin loading
        try {
          const response = await fetch(
            'http://localhost:5001/auth/me',
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data.success) {
            setUserRole(data.data.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setLoading(false); // If not logged in, not loading
      }
    };

    fetchUserRole();
  }, [isLoggedIn]);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
