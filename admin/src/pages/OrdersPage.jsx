// admin/src/pages/OrdersPage.jsx
import { orderApi } from "../lib/api";
import { formatDate} from "../lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PlusIcon, EyeIcon, Trash2Icon } from "lucide-react";

function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Obtener órdenes directamente (no ordersData.orders)
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  // Mutación para actualizar estado
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

  // Mutación para eliminar orden
  const deleteOrderMutation = useMutation({
    mutationFn: orderApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      alert("✅ Orden eliminada correctamente");
    },
    onError: (error) => {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar la orden");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleDelete = (orderId) => {
    if (window.confirm("¿Estás seguro de eliminar esta orden permanentemente?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  // Asegurar que orders es un array
  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div className="space-y-6 p-6">
      {/* HEADER con botón */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
          <p className="text-gray-600">Gestiona las órdenes de los clientes</p>
        </div>
        <button
          onClick={() => navigate("/orders/new")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Orden
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : ordersList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-semibold mb-2">No hay órdenes aún</p>
              <p className="text-sm">Las órdenes aparecerán aquí cuando los clientes realicen compras</p>
              <button
                onClick={() => navigate("/orders/new")}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Crear primera orden →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => {
                    const totalQuantity = order.orderItems?.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    ) || 0;

                    return (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
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
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{totalQuantity} items</div>
                          <div className="text-sm text-gray-500">
                            {order.orderItems?.[0]?.name || "Sin productos"}
                            {order.orderItems?.length > 1 && ` +${order.orderItems.length - 1} más`}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            ${order.totalPrice?.toFixed(2) || "0"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white ${
                              order.status === 'delivered' ? 'border-green-400 bg-green-50 text-green-700' :
                              order.status === 'shipped' ? 'border-blue-400 bg-blue-50 text-blue-700' :
                              'border-yellow-400 bg-yellow-50 text-yellow-700'
                            }`}
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
                              title="Eliminar orden"
                            >
                              <Trash2Icon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;