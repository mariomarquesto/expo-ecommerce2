// employes/src/store/authStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/employee/auth";

export const useAuthStore = create((set) => ({
  employee: null,
  token: null,
  isAuthenticated: false,
  
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, employee } = response.data;
      
      localStorage.setItem("employeeToken", token);
      localStorage.setItem("employee", JSON.stringify(employee));
      
      set({ employee, token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al iniciar sesión" };
    }
  },
  
  logout: () => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employee");
    set({ employee: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem("employeeToken");
    const employee = localStorage.getItem("employee");
    
    if (token && employee) {
      set({ token, employee: JSON.parse(employee), isAuthenticated: true });
    }
  },
}));