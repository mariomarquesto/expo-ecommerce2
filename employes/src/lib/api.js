// employes/src/lib/api.js
import axiosInstance from "./axios";

// URL base del backend
const API_URL = "http://localhost:3000/api";

// --- ESTADÍSTICAS (usar las mismas que admin) ---
export const statsApi = {
  getDashboard: async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/stats");
      return data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 };
    }
  },
};

// --- ÓRDENES (usar las mismas que admin) ---
export const orderApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/orders");
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      return [];
    }
  },
};

// --- PRODUCTOS (usar las mismas que admin) ---
export const productApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/products");
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  },
};

// --- CLIENTES (usar /api/customers) ---
export const customerApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/api/customers");
      return data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return [];
    }
  },
};

// --- TAREAS (para empleados) ---
export const taskApi = {
  getMyTasks: async () => {
    try {
      const { data } = await axiosInstance.get("/api/employee/tasks");
      return data;
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  },
};

// --- ASISTENCIA (para empleados) ---
export const attendanceApi = {
  getMyAttendance: async () => {
    try {
      const { data } = await axiosInstance.get("/api/employee/attendance");
      return data;
    } catch (error) {
      console.error("Error al obtener asistencia:", error);
      return [];
    }
  },
};