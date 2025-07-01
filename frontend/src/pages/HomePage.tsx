import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after a brief delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-16 md:pt-24">
      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="container mx-auto py-12 md:py-20 px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              Orange Cheese Pizza
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700">
              Hungry? You're in the right place. Order fresh, delicious pizza
              now!
            </p>

            <div className="flex space-x-4">
              <Link
                to="/menu"
                className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md transition-colors font-medium"
              >
                View Menu
              </Link>
              {isLoaded && (
                <Link
                  to="/login"
                  className="bg-white border border-primary text-primary hover:bg-gray-50 py-3 px-6 rounded-md transition-colors font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:w-1/2 relative flex justify-center">
            {isLoaded ? (
              <img
                src="/images/"
                alt="Pizza"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            ) : (
              <div className="h-64 w-full max-w-md bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <p className="text-gray-400">Loading image...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {isLoaded && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Our Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                "Veg Pizzas",
                "Non-Veg Pizzas",
                "Value Meals",
                "Garlic Bread",
                "Beverages",
                "Desserts",
                "Sides",
                "Combos",
              ].map((category) => (
                <Link
                  to="/menu"
                  key={category}
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center shadow-sm transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/menu"
                className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md transition-colors font-medium inline-block"
              >
                Browse Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
