// admin/src/lib/api.js
import axiosInstance from "./axios";

// --- PRODUCTOS ---
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

  create: async (formData) => {
    const { data } = await axiosInstance.post("/api/admin/products", formData);
    return data;
  },

  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`/api/admin/products/${id}`, formData);
    return data;
  },

  delete: async (productId) => {
    const { data } = await axiosInstance.delete(`/api/admin/products/${productId}`);
    return data;
  },
};

// --- ÓRDENES ---
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

  getById: async (orderId) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/orders/${orderId}`);
      return data;
    } catch (error) {
      console.error("Error al obtener orden:", error);
      return null;
    }
  },

  create: async (orderData) => {
    const { data } = await axiosInstance.post("/api/admin/orders", orderData);
    return data;
  },

  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(`/api/admin/orders/${orderId}/status`, { status });
    return data;
  },

  delete: async (orderId) => {
    const { data } = await axiosInstance.delete(`/api/admin/orders/${orderId}`);
    return data;
  },
};

// --- ESTADÍSTICAS ---
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

// --- CLIENTES ---
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

  create: async (customerData) => {
    const { data } = await axiosInstance.post("/api/customers", customerData);
    return data;
  },

  update: async (id, customerData) => {
    const { data } = await axiosInstance.put(`/api/customers/${id}`, customerData);
    return data;
  }
};