// employes/src/pages/DashboardPage.jsx
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
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
        <h1 className="text-3xl font-bold text-gray-900">Panel</h1>
        <p className="text-gray-600 mt-1">Visión general del comercio electrónico</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div><p className="text-sm text-gray-500">Ingresos</p><h2 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h2></div>
            <DollarSignIcon className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div><p className="text-sm text-gray-500">Pedidos</p><h2 className="text-2xl font-bold">{totalOrders}</h2></div>
            <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div><p className="text-sm text-gray-500">Clientes</p><h2 className="text-2xl font-bold">{totalCustomers}</h2></div>
            <UsersIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div><p className="text-sm text-gray-500">Productos</p><h2 className="text-2xl font-bold">{totalProducts}</h2></div>
            <PackageIcon className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Pedidos Recientes</h2>
          <button className="text-emerald-600 text-sm">Ver todos →</button>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No hay órdenes recientes</div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b"><th className="text-left py-2">ID</th><th className="text-left">Cliente</th><th className="text-left">Total</th><th className="text-left">Estado</th><th className="text-left">Fecha</th></tr></thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.shippingAddress?.fullName}</td>
                    <td>${order.totalPrice?.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;