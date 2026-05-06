// admin/src/pages/OrderDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../lib/api";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";


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
      alert("✅ Estado actualizado");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: () => orderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("✅ Orden eliminada");
      navigate("/orders");
    },
  });

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
        <button onClick={() => navigate("/orders")} className="mt-4 text-emerald-600">Volver</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate("/orders")} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="w-5 h-5" /> Volver a órdenes
        </button>

        <div className=" rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Detalle de Orden</h1>
              <p className="text-blue-100 text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <select value={order.status} onChange={(e) => updateStatusMutation.mutate({ orderId: id, status: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="pending">Pendiente</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
              </select>
              <button onClick={() => { if (confirm("¿Eliminar?")) deleteOrderMutation.mutate(); }} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cliente</h3>
              <p className="text-gray-800">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600 text-sm">{order.user?.email}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Envío</h3>
              <p className="text-gray-800">{order.shippingAddress?.streetAddress}</p>
              <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p className="text-gray-600">Tel: {order.shippingAddress?.phoneNumber}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="text-left py-2 px-3">Producto</th><th className="text-center py-2 px-3">Cantidad</th><th className="text-right py-2 px-3">Subtotal</th></tr>
                </thead>
                <tbody>
                  {order.orderItems?.map((item, i) => (
                    <tr key={i} className="border-t"><td className="py-2 px-3">{item.name}</td><td className="text-center py-2 px-3">{item.quantity}</td><td className="text-right py-2 px-3">${(item.price * item.quantity).toFixed(2)}</td></tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan="2" className="text-right py-3 px-3 font-semibold">Total:</td><td className="text-right py-3 px-3 font-bold">${order.totalPrice?.toFixed(2)}</td></tr></tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}