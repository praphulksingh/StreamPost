import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        // User is not logged in or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);