import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="container mx-auto py-20 px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hello Dear,</h1>
            <p className="text-xl mb-6">
              Hungry? You're in right place... Order From!
            </p>

            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Enter a location"
                className="input pr-10 w-full"
              />
              <button className="btn btn-primary absolute right-0 top-0 bottom-0 rounded-l-none">
                SEARCH
              </button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Delivery Image Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Veg Pizzas",
              "Non-Veg Pizzas",
              "Value Pizza",
              "Garlic Bread",
            ].map((category) => (
              <div
                key={category}
                className="bg-gray-100 p-4 rounded-lg text-center"
              >
                {category}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/menu" className="btn btn-primary">
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
