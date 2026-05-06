// admin/src/pages/OrderDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../lib/api";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getById(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => orderApi.updateStatus({ orderId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("✅ Estado actualizado correctamente");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: () => orderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("✅ Orden eliminada correctamente");
      navigate("/orders");
    },
  });

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate({ orderId: id, status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de eliminar esta orden permanentemente?")) {
      deleteOrderMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Orden no encontrada</p>
        <button onClick={() => navigate("/orders")} className="mt-4 text-emerald-600">
          Volver a órdenes
        </button>
      </div>
    );
  }

  const totalQuantity = order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'border-green-400 bg-green-50 text-green-700';
      case 'shipped': return 'border-blue-400 bg-blue-50 text-blue-700';
      default: return 'border-yellow-400 bg-yellow-50 text-yellow-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Entregada';
      case 'shipped': return 'Enviada';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a órdenes
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Detalle de Orden</h1>
              <p className="text-blue-100 text-sm">#{order._id?.slice(-8).toUpperCase() || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white ${getStatusColor(order.status)}`}
              >
                <option value="pending">Pendiente</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
              </select>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Estado actual:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cliente</h3>
              <p className="text-gray-800 font-medium">{order.shippingAddress?.fullName || "N/A"}</p>
              <p className="text-gray-600 text-sm">{order.user?.email || "No disponible"}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Envío</h3>
              <p className="text-gray-800">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600 text-sm">{order.shippingAddress?.streetAddress}</p>
              <p className="text-gray-600 text-sm">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p className="text-gray-600 text-sm">Tel: {order.shippingAddress?.phoneNumber}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos ({totalQuantity} items)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Producto</th>
                      <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Cantidad</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Precio</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems?.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 px-3 text-gray-800">{item.name}</td>
                        <td className="py-3 px-3 text-center text-gray-800">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-gray-800">${item.price?.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right text-gray-800">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2">
                    <tr>
                      <td colSpan="3" className="text-right py-3 px-3 font-semibold text-gray-900">Total:</td>
                      <td className="text-right py-3 px-3 font-bold text-emerald-600">${order.totalPrice?.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Creada: {formatDate(order.createdAt)}</span>
              {order.deliveredAt && <span>Entregada: {formatDate(order.deliveredAt)}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}