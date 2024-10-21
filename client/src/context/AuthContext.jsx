// import React, { createContext, useState, useEffect } from 'react';
// import { login as loginApi, register as registerApi } from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setUser({ id: localStorage.getItem('userId') });
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     const response = await loginApi(credentials);
//     localStorage.setItem('token', response.data.token);
//     localStorage.setItem('userId', response.data.userId);
//     setUser({ id: response.data.userId });
//   };

//   const register = async (userData) => {
//     await registerApi(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { login as loginApi, register as registerApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decodedToken.exp < currentTime) {
        // Token expired, logout the user
        logout();
      } else {
        // Token valid, set user
        setUser({ id: localStorage.getItem('userId') });

        // Set a timeout to automatically logout when the token expires
        const timeUntilExpiry = (decodedToken.exp * 1000) - Date.now();
        setTimeout(() => {
          logout();
        }, timeUntilExpiry);
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const token = response.data.token;
    const userId = response.data.userId;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    
    const decodedToken = jwtDecode(token);
    const timeUntilExpiry = (decodedToken.exp * 1000) - Date.now();
    
    // Automatically log the user out when the token expires
    setTimeout(() => {
      logout();
    }, timeUntilExpiry);
    
    setUser({ id: userId });
  };

  const register = async (userData) => {
    await registerApi(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
