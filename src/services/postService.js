import axios from "axios";

const API_URL = "http://localhost:3000";

export const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const getPostBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/posts/${slug}`);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};
