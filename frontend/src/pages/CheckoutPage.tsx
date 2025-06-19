import React from "react";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">Checkout placeholder</p>
        <div className="flex justify-center">
          <Link to="/cart" className="btn btn-outline mr-4">
            Back to Cart
          </Link>
          <button className="btn btn-primary">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
