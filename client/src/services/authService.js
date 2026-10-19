import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-smart-study-planner-dhc6.onrender.com/api",
});

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};