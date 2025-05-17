import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const createNote = (noteData) => {
  const token = sessionStorage.getItem("authToken");
  return axios.post(`${API_BASE}/notes/create`, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchMyNotes = ({owner, page, limit}) => {
  const token = sessionStorage.getItem("authToken");
  return axios.get(`${API_BASE}/notes/my-notes`, {
    params: { owner, page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSingleNote = (noteId) => {
  const token = sessionStorage.getItem("authToken");
  return axios.get(`${API_BASE}/notes/single/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteNote = (noteId) => {
  const token = sessionStorage.getItem("authToken");
  return axios.delete(`${API_BASE}/notes/delete/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const shareNote = (payload) => {
  const token = sessionStorage.getItem("authToken");
  return axios.post(`${API_BASE}/notes/share`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
