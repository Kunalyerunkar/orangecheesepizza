import React from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  return (
    <div className="container page-container">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        <div className="flex justify-center">
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
