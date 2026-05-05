// admin/src/lib/utils.js
export const capitalizeText = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold";
    case "shipped":
      return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold";
    case "pending":
      return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold";
    default:
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold";
  }
};

export const getStockStatusBadge = (stock) => {
  if (stock === 0) return { text: "Sin Stock", class: "bg-red-100 text-red-800" };
  if (stock < 20) return { text: "Stock Bajo", class: "bg-yellow-100 text-yellow-800" };
  return { text: "En Stock", class: "bg-green-100 text-green-800" };
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("es-AR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};