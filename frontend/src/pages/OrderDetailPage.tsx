import React from "react";
import { Link, useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container page-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Link to="/orders" className="btn btn-outline">
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Order #{id}</h2>
              <p className="text-gray-600">Placed on: June 18, 2023</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Processing
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Delivery Address
              </h3>
              <p className="text-gray-600">
                123 Main Street
                <br />
                Apartment 4B
                <br />
                Mumbai, 400001
                <br />
                India
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Payment Information
              </h3>
              <p className="text-gray-600">
                Payment Method: Cash on Delivery
                <br />
                Status: Pending
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>

          <div className="border-b pb-4 mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <h4 className="font-medium">Cheese & Tomato Pizza</h4>
                <p className="text-gray-600 text-sm">
                  Medium, Classic Hand Tossed
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹350.00</p>
                <p className="text-gray-600 text-sm">Qty: 1</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <h4 className="font-medium">Garlic Bread</h4>
                <p className="text-gray-600 text-sm">Regular</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹120.00</p>
                <p className="text-gray-600 text-sm">Qty: 1</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">₹470.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Delivery Fee</p>
              <p className="font-medium">₹30.00</p>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <p className="font-bold">Total</p>
              <p className="font-bold">₹500.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
