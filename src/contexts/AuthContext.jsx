import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// API gốc
const API_URL = "http://localhost:3000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Đăng nhập
  const login = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    const res = await axios.get(`${API_URL}/users`, {
      params: { username, password },
    });

    const data = res.data;

    if (data.length === 0) throw new Error("Sai thông tin đăng nhập");

    const loggedUser = data[0];
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Đăng ký
  const register = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    // Kiểm tra tên người dùng đã tồn tại
    const res = await axios.get(`${API_URL}/users`, {
      params: { username },
    });

    if (res.data.length > 0) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    const newUser = { username, password, role: "viewer" };

    await axios.post(`${API_URL}/users`, newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng trong component
export const useAuth = () => useContext(AuthContext);
