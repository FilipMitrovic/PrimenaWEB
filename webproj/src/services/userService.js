import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // iz .env fajla

export const registerUser = async (userDto) => {
  return await axios.post(`${API_URL}/api/users/register`, userDto);
};

export const loginUser = async (loginDto) => {
  return await axios.post(`${API_URL}/api/users/login`, loginDto);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userImage");
};
