import React from "react";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  // Dummy orders data
  const orders = [
    {
      id: "1001",
      date: "June 18, 2023",
      status: "Delivered",
      total: 500.0,
      items: 3,
    },
    {
      id: "1002",
      date: "June 15, 2023",
      status: "Delivered",
      total: 350.0,
      items: 2,
    },
    {
      id: "1003",
      date: "June 10, 2023",
      status: "Delivered",
      total: 720.0,
      items: 4,
    },
  ];

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden md:grid md:grid-cols-5 p-4 bg-gray-50 font-medium text-gray-700">
            <div>Order ID</div>
            <div>Date</div>
            <div>Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-1 md:grid-cols-5 p-4 border-b gap-2 md:gap-0 items-center"
            >
              <div className="font-medium">
                <span className="md:hidden font-bold mr-2">Order ID:</span>#
                {order.id}
              </div>
              <div>
                <span className="md:hidden font-bold mr-2">Date:</span>
                {order.date}
              </div>
              <div>
                <span className="md:hidden font-bold mr-2">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {order.status}
                </span>
              </div>
              <div>
                <span className="md:hidden font-bold mr-2">Total:</span>₹
                {order.total.toFixed(2)}
              </div>
              <div>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start ordering delicious food!
          </p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
