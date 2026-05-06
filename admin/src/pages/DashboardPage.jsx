// employes/src/pages/DashboardPage.jsx
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import {
  DollarSignIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import { formatDate } from "../lib/utils";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  const totalRevenue = statsData?.totalRevenue || 0;
  const totalOrders = statsData?.totalOrders || 0;
  const totalCustomers = statsData?.totalCustomers || 0;
  const totalProducts = statsData?.totalProducts || 0;

  const recentOrders = Array.isArray(ordersData) ? ordersData.slice(0, 5) : [];

  const statsCards = [
    { name: "Ingresos", value: totalRevenue, icon: <DollarSignIcon className="size-8" />, color: "text-emerald-600", prefix: "$" },
    { name: "Pedidos", value: totalOrders, icon: <ShoppingBagIcon className="size-8" />, color: "text-blue-600", prefix: "" },
    { name: "Clientes", value: totalCustomers, icon: <UsersIcon className="size-8" />, color: "text-purple-600", prefix: "" },
    { name: "Productos", value: totalProducts, icon: <PackageIcon className="size-8" />, color: "text-amber-600", prefix: "" },
  ];

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visión general del comercio electrónico</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.prefix}{stat.value.toFixed(2)}
                </h2>
              </div>
              <div className={`p-3 rounded-xl bg-gray-100 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No hay órdenes recientes</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Estado</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm text-gray-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-2 px-3 text-gray-900">
                        {order.shippingAddress?.fullName || "N/A"}
                      </td>
                      <td className="py-2 px-3 font-semibold text-gray-900">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status === "delivered" ? "Entregado" : 
                           order.status === "shipped" ? "Enviado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
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

export default DashboardPage;