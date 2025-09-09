
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5131";
console.log("API URL:", API_URL);
const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllQuizzes = async () => {
    return await axios.get(`${API_URL}/api/quizzes`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  };
  
  const getQuizById = async (id) => {
    return await axios.get(`${API_URL}/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  };
  
  const createQuiz = async (quizData) => {
    return await axios.post(`${API_URL}/api/quizzes`, quizData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  };
  
  const updateQuiz = async (id, quizData) => {
    return await axios.put(`${API_URL}/api/quizzes/${id}`, quizData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  };
  
  const deleteQuiz = async (id) => {
    return await axios.delete(`${API_URL}/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  };
  

export default {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
