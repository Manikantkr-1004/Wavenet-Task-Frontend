import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;
const token = sessionStorage.getItem("authToken");

export const signupUser = (userData) => {
  return axios.post(`${API_BASE}/auth/signup`, userData);
};

export const loginUser = (userData) => {
  return axios.post(`${API_BASE}/auth/login`, userData);
};

export const checkAuth = () => {
  return axios.get(`${API_BASE}/auth/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
