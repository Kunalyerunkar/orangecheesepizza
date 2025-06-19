import React from "react";
import { Link, useParams } from "react-router-dom";

const OrderConfirmationPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. Your order ID is{" "}
          <span className="font-bold">{id}</span>.
        </p>

        <p className="text-gray-600 mb-8">
          You will receive a confirmation on your phone shortly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/orders" className="btn btn-primary">
            View Orders
          </Link>
          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
