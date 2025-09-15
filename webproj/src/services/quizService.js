// src/services/quizService.js
import axios from "axios";
import { QuizModel } from "../models/QuizModel";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";
const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllQuizzes = async () => {
  const res = await axios.get(`${API_URL}/api/quizzes`, { headers: authHeaders() });
  return (res.data || []).map(
    (q) => new QuizModel(q.id, q.title, q.description, q.category, q.difficulty, q.timeLimit)
  );
};

const getQuizById = async (id) => {
  const res = await axios.get(`${API_URL}/api/quizzes/${id}`, { headers: authHeaders() });
  const q = res.data;
  return new QuizModel(q.id, q.title, q.description, q.category, q.difficulty, q.timeLimit);
};

const createQuiz = async (quizData) => {
  const res = await axios.post(`${API_URL}/api/quizzes`, quizData, { headers: authHeaders() });
  const q = res.data;
  return new QuizModel(q.id, q.title, q.description, q.category, q.difficulty, q.timeLimit);
};

const updateQuiz = async (id, quizData) => {
  const res = await axios.put(`${API_URL}/api/quizzes/${id}`, quizData, { headers: authHeaders() });
  const q = res.data;
  return new QuizModel(q.id, q.title, q.description, q.category, q.difficulty, q.timeLimit);
};

const deleteQuiz = async (id) => {
  return await axios.delete(`${API_URL}/api/quizzes/${id}`, { headers: authHeaders() });
};

export default {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
