import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Set auth token for axios requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Login user
export const loginUser = async ({ username, password }) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  
  const { token, user } = response.data;
  
  // Store token and user data
  setAuthToken(token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};

// Register user
export const registerUser = async ({ username, password, email, role = "viewer" }) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password,
    email,
    role
  });
  return response.data;
};

// Logout user
export const logoutUser = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
}; 