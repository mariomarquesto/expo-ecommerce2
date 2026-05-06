// employes/src/pages/SalesPage.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../lib/api";
import { PlusIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";

function SalesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      alert("✅ Estado actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error al actualizar estado:", error);
      alert("❌ Error al actualizar el estado");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: orderApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      alert("✅ Venta eliminada correctamente");
    },
    onError: (error) => {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar la venta");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleDelete = (orderId) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta permanentemente?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const ordersList = Array.isArray(orders) ? orders : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas las ventas realizadas</p>
        </div>
        <button
          onClick={() => navigate("/sales/new")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {ordersList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-semibold mb-2">No hay ventas registradas</p>
              <p className="text-sm">Las ventas aparecerán aquí cuando se realicen</p>
              <button
                onClick={() => navigate("/sales/new")}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Registrar primera venta →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-700">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {order.shippingAddress?.fullName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.orderItems?.length || 0} producto(s)
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-gray-900">
                          ${order.totalPrice?.toFixed(2) || "0"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer ${getStatusColor(order.status)}`}
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Ver detalles"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar venta"
                          >
                            <Trash2Icon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;