import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role") || "member";
  const userId = localStorage.getItem("userId") || "karthik";

  config.headers["x-user-id"] = userId;
  config.headers["x-role"] = role;

  return config;
});

export default api;
