// src/services/resultService.js
import axios from "axios";
import { ResultModel } from "../models/ResultModel";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// CREATE → koristi CreateResultDTO (plain object), vraća ResultModel
const createResult = async (data) => {
  const res = await axios.post(`${API_URL}/api/Result`, data, {
    headers: authHeaders(),
  });
  const r = res.data;
  return new ResultModel(
    r.id,
    r.userId,
    r.quizId,
    r.correctAnswers,
    r.totalQuestions,
    r.scorePercent,
    r.durationSeconds,
    r.takenAt,
    r.userName,
    r.quizTitle,
    r.answers ?? null
  );
};

// MY RESULTS
const getMyResults = async () => {
  const res = await axios.get(`${API_URL}/api/Result/me`, {
    headers: authHeaders(),
  });
  return (res.data || []).map(
    (r) =>
      new ResultModel(
        r.id,
        r.userId,
        r.quizId,
        r.correctAnswers,
        r.totalQuestions,
        r.scorePercent,
        r.durationSeconds,
        r.takenAt,
        r.userName,
        r.quizTitle,
        r.answers ?? null
      )
  );
};

// RESULTS BY QUIZ
const getResultsByQuiz = async (quizId) => {
  const res = await axios.get(`${API_URL}/api/Result/quiz/${quizId}`, {
    headers: authHeaders(),
  });
  return (res.data || []).map(
    (r) =>
      new ResultModel(
        r.id,
        r.userId,
        r.quizId,
        r.correctAnswers,
        r.totalQuestions,
        r.scorePercent,
        r.durationSeconds,
        r.takenAt,
        r.userName,
        r.quizTitle,
        r.answers ?? null
      )
  );
};

// SINGLE RESULT
const getResult = async (id) => {
  const res = await axios.get(`${API_URL}/api/Result/${id}`, {
    headers: authHeaders(),
  });
  const r = res.data;
  return new ResultModel(
    r.id,
    r.userId,
    r.quizId,
    r.correctAnswers,
    r.totalQuestions,
    r.scorePercent,
    r.durationSeconds,
    r.takenAt,
    r.userName,
    r.quizTitle,
    r.answers ?? null
  );
};

const deleteResult = async (id) => {
  return await axios.delete(`${API_URL}/api/Result/${id}`, {
    headers: authHeaders(),
  });
};

export default {
  createResult,
  getMyResults,
  getResultsByQuiz,
  getResult,
  deleteResult,
};
