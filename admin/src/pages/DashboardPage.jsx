import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import {
  DollarSignIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import {
  capitalizeText,
  formatDate,
  getOrderStatusBadge,
} from "../lib/utils";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      name: "Revenue",
      value: statsLoading
        ? "..."
        : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-8" />,
      color: "text-success",
    },
    {
      name: "Orders",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-8" />,
      color: "text-primary",
    },
    {
      name: "Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UsersIcon className="size-8" />,
      color: "text-secondary",
    },
    {
      name: "Products",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-8" />,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/60">
          Overview of your ecommerce performance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-base-content/60">
                    {stat.name}
                  </p>
                  <h2 className="text-2xl font-bold">
                    {stat.value}
                  </h2>
                </div>
                <div
                  className={`p-3 rounded-xl bg-base-200 ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl">
              Recent Orders
            </h2>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 text-base-content/60">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover"
                    >
                      <td className="font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems.length} item(s)
                          </div>
                        </div>
                      </td>

                      <td className="font-semibold">
                        ${order.totalPrice.toFixed(2)}
                      </td>

                      <td>
                        <div
                          className={`badge ${getOrderStatusBadge(
                            order.status
                          )}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>

                      <td className="text-sm opacity-60">
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