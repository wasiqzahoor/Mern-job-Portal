import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    const loadUserData = async () => {
      console.log('AuthContext: loadUserData started.');
      setLoading(true);
      setIsAuthenticated(false);

      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      
      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);

        
        let apiEndpoint = '';
        if (storedRole === 'admin') {
          apiEndpoint = 'http://localhost:4002/api/admin/me';
        } else if (storedRole === 'company') {
          apiEndpoint = 'http://localhost:4002/api/companies/me';
        } else if (storedRole === 'user') {
          apiEndpoint = 'http://localhost:4002/api/users/me';
        } else {
          
          console.error(`AuthContext: Unrecognized role "${storedRole}" found. Logging out.`);
          logout();
          return;
        }

        console.log(`AuthContext: Role is "${storedRole}". Calling API: ${apiEndpoint}`);

        try {
          
          const res = await fetch(apiEndpoint, {
            headers: { 
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            },
          });

          if (!res.ok) {
            
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();

          console.log('AuthContext: API response data:', data);

          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true); 
            
           
            if (data.user.role !== storedRole) {
                console.warn(`AuthContext: Role mismatch! Stored: ${storedRole}, Fetched: ${data.user.role}. Updating.`);
                setRole(data.user.role);
                localStorage.setItem("role", data.user.role);
            }

          } else {
            console.error("AuthContext: API call successful but failed to get user data:", data.message);
            logout(); 
          }
        } catch (error) {
          console.error(`AuthContext: Error fetching data from ${apiEndpoint}:`, error);
          
          if (error.message.includes('401') || error.message.includes('403')) {
            console.log("AuthContext: Authentication error, logging out.");
            logout();
          } else {
            
            setIsAuthenticated(false);
          }
        }
      } else {
        console.log('AuthContext: No token/role found in localStorage.');
        
        logout();
      }
      
      setLoading(false);
      console.log('AuthContext: loadUserData finished.');
    };

    loadUserData();
  }, []); 
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() > expiry) {
          console.log('AuthContext: Token expired, logging out.');
          logout();
        }
      } catch (e) {
        console.error("AuthContext: Malformed token. Logging out.", e);
        logout();
      }
    }
  }, [token]);

  
  const login = (newToken, userRole, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);
    setToken(newToken);
    setRole(userRole);
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
    console.log('AuthContext: Login successful. User data set:', userData);
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false); 
    console.log('AuthContext: Logout complete.');
  };

  
  const hasRole = (requiredRole) => {
    return isAuthenticated && user && user.role === requiredRole;
  };

  const checkAuth = () => {
    return isAuthenticated && token && user;
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      role, 
      user, 
      loading, 
      isAuthenticated,
      login, 
      logout,
      hasRole,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};