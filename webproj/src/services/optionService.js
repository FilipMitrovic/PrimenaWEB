import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";
const getToken = () => localStorage.getItem("token");
const auth = () => ({ Authorization: `Bearer ${getToken()}` });

export const getOptionsByQuestion = async (questionId) =>
  axios.get(`${API_URL}/api/Option/question/${questionId}`, { headers: auth() });

// ADMIN
export const createOption = async (dto) =>
  axios.post(`${API_URL}/api/Option`, dto, { headers: auth() });

export const updateOption = async (id, dto) =>
  axios.put(`${API_URL}/api/Option/${id}`, dto, { headers: auth() });

export const deleteOption = async (id) =>
  axios.delete(`${API_URL}/api/Option/${id}`, { headers: auth() });
