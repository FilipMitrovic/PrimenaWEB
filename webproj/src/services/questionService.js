import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";
const getToken = () => localStorage.getItem("token");
const auth = () => ({ Authorization: `Bearer ${getToken()}` });

export const getQuestionsByQuiz = async (quizId) =>
  axios.get(`${API_URL}/api/Question/quiz/${quizId}`, { headers: auth() });

export const getQuestion = async (id) =>
  axios.get(`${API_URL}/api/Question/${id}`, { headers: auth() });

// ADMIN
export const createQuestion = async (dto) =>
  axios.post(`${API_URL}/api/Question`, dto, { headers: auth() });

export const updateQuestion = async (id, dto) =>
  axios.put(`${API_URL}/api/Question/${id}`, dto, { headers: auth() });

export const deleteQuestion = async (id) =>
  axios.delete(`${API_URL}/api/Question/${id}`, { headers: auth() });
