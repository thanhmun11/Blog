import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, setAuthToken, getCurrentUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getCurrentUser();
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    try {
      const response = await loginUser({ username, password });
      const { token, user: userData } = response;
      
      setAuthToken(token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // Đăng xuất
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  // Đăng ký
  const register = async ({ username, password, email, role = "viewer" }) => {
    if (!username || !password || !email) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    try {
      const response = await registerUser({ username, password, email, role });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng trong component
export const useAuth = () => useContext(AuthContext);
