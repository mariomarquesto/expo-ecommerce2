// admin/src/lib/api.js
import axiosInstance from "./axios";

// --- PRODUCTOS ---
export const productApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("api/admin/products"); // ✅
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  },

  create: async (formData) => {
    const { data } = await axiosInstance.post("api/admin/products", formData);
    return data;
  },

  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`api/admin/products/${id}`, formData);
    return data;
  },

  delete: async (productId) => {
    const { data } = await axiosInstance.delete(`api/admin/products/${productId}`);
    return data;
  },
};

// --- ÓRDENES ---
export const orderApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/orders");
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      return [];
    }
  },

  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    return data;
  },
};

// --- ESTADÍSTICAS ---
export const statsApi = {
  getDashboard: async () => {
    try {
      const { data } = await axiosInstance.get("/stats");
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
      const { data } = await axiosInstance.get("/customers");
      return data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return [];
    }
  },

  create: async (customerData) => {
    const { data } = await axiosInstance.post("/customers", customerData);
    return data;
  },

  update: async (id, customerData) => {
    const { data } = await axiosInstance.put(`/customers/${id}`, customerData);
    return data;
  }
};