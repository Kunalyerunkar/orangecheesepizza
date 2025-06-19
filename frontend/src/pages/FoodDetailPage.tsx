import React from "react";
import { Link, useParams } from "react-router-dom";

const FoodDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Food Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">
          Food item details for ID: {id}
        </p>
        <div className="flex justify-center">
          <Link to="/menu" className="btn btn-outline mr-4">
            Back to Menu
          </Link>
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
