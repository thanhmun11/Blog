import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all users
export const getUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Create new user
export const createUser = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/users`, userData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/${id}`, userData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};



// Update current user profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/profile`, profileData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
