import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};


const createResult = async (data) => {
  return await axios.post(`${API_URL}/api/Result`, data, {
    headers: { ...authHeaders() },
  });
};

const getMyResults = async () => {
  return await axios.get(`${API_URL}/api/Result/me`, {
    headers: { ...authHeaders() },
  });
};


const getResultsByQuiz = async (quizId) => {
  return await axios.get(`${API_URL}/api/Result/quiz/${quizId}`, {
    headers: { ...authHeaders() },
  });
};

const getResult = async (id) => {
  return await axios.get(`${API_URL}/api/Result/${id}`, {
    headers: { ...authHeaders() },
  });
};


const deleteResult = async (id) => {
  return await axios.delete(`${API_URL}/api/Result/${id}`, {
    headers: { ...authHeaders() },
  });
};

export default {
  createResult,
  getMyResults,
  getResultsByQuiz,
  getResult,
  deleteResult,
};
