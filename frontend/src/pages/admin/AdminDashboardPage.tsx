import React from "react";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  // Dummy stats
  const stats = [
    { name: "Total Orders", value: 456, icon: "📦" },
    { name: "Total Users", value: 2893, icon: "👥" },
    { name: "Total Foods", value: 78, icon: "🍕" },
    { name: "Revenue", value: "₹89,432", icon: "💰" },
  ];

  // Dummy recent orders
  const recentOrders = [
    {
      id: "1001",
      user: "John Doe",
      date: "18 Jun 2023",
      total: "₹500",
      status: "Delivered",
    },
    {
      id: "1002",
      user: "Jane Smith",
      date: "18 Jun 2023",
      total: "₹720",
      status: "Processing",
    },
    {
      id: "1003",
      user: "Mike Johnson",
      date: "17 Jun 2023",
      total: "₹350",
      status: "Pending",
    },
    {
      id: "1004",
      user: "Sarah Williams",
      date: "17 Jun 2023",
      total: "₹890",
      status: "Delivered",
    },
    {
      id: "1005",
      user: "David Brown",
      date: "16 Jun 2023",
      total: "₹460",
      status: "Delivered",
    },
  ];

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-4xl mr-4">{stat.icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-primary hover:text-primary-dark"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
