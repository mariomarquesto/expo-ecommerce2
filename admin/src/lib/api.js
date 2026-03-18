import axiosInstance from "./axios";

// --- PRODUCTOS ---
export const productApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/admin/products");
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  },

  create: async (formData) => {
    const { data } = await axiosInstance.post("/admin/products", formData);
    return data;
  },

  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
    return data;
  },

  delete: async (productId) => {
    const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
    return data;
  },
};

// --- ÓRDENES ---
export const orderApi = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      return [];
    }
  },

  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    return data;
  },
};

// --- ESTADÍSTICAS ---
export const statsApi = {
  getDashboard: async () => {
    try {
      // Usamos /admin/stats porque está en admin.route.js
      const { data } = await axiosInstance.get("/admin/stats");
      return data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 };
    }
  },
};

// --- CLIENTES (RUTA FINAL) ---
export const customerApi = {
  getAll: async () => {
    try {
      // ⚠️ AHORA SÍ LLEVA /admin porque lo registramos en admin.route.js
      const { data } = await axiosInstance.get("/admin/customers");
      return data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return []; 
    }
  },

  create: async (customerData) => {
    const { data } = await axiosInstance.post("/admin/customers", customerData);
    return data;
  },

  update: async (id, customerData) => {
    const { data } = await axiosInstance.put(`/admin/customers/${id}`, customerData);
    return data;
  }
};