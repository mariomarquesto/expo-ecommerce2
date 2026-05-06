// employes/src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Puerto del backend
  withCredentials: true,
});

export default axiosInstance;