import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import { Food } from "../../types";

interface FoodCardProps {
  food: Food;
}

const FoodCard = ({ food }: FoodCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    // Add to cart with default customizations
    addToCart(
      food,
      1, // quantity
      {
        // customizations
        size: food.customizationOptions.sizes
          ? food.customizationOptions.sizes[0]
          : undefined,
        crust: food.customizationOptions.crusts
          ? food.customizationOptions.crusts[0]
          : undefined,
        toppings: [],
      },
      "" // special instructions
    );

    toast.success(`${food.name} added to cart!`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/food/${food._id}`} className="block relative">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-48 object-cover"
        />
        {food.specialOffer && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            Special Offer
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < Math.floor(food.ratings)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
              size={14}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({food.numReviews})
          </span>
        </div>

        <Link to={`/food/${food._id}`} className="block">
          <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">
            {food.name}
          </h3>
        </Link>

        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-gray-800">
            ₹{food.price} – ₹{food.price + 200}
          </p>

          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
