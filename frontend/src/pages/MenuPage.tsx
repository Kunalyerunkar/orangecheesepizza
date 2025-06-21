import React, { useState } from "react";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Veg Pizzas",
    "Non-Veg Pizzas",
    "Value Pizza",
    "Garlic Bread",
    "Taco",
    "Appetizer",
    "Kebab",
    "Momo",
    "Burger",
    "Dessert",
    "Biryani",
  ];

  return (
    <div className="container page-container">
      <h1 className="text-3xl font-bold mb-8">Menu</h1>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search your favorite food..."
            className="input w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items - Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="h-48 bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Food Image Placeholder</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">Food Item {item}</h3>
              <p className="text-gray-600 text-sm mb-2">
                Description goes here
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">₹299</span>
                <button className="btn btn-primary btn-sm">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
