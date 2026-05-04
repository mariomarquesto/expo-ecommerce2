// admin/src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // ← Sin /api
  withCredentials: true,
});

export default axiosInstance;