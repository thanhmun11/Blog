import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all posts
export const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

// Get post by ID
export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

// Create new post
export const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Debug
  console.log('Post data:', postData); // Debug
  
  const response = await axios.post(`${API_URL}/posts`, postData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Update post
export const updatePost = async (id, postData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Delete post
export const deletePost = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/posts/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Get comments for a post
export const getComments = async (postId) => {
  const response = await axios.get(`${API_URL}/comments/post/${postId}`);
  return response.data;
};

// Create comment
export const createComment = async (commentData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/comments`, commentData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
