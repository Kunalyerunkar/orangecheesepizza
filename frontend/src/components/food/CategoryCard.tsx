import React from "react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
}

const CategoryCard = ({ name, image, count }: CategoryCardProps) => {
  return (
    <Link
      to={`/menu?category=${encodeURIComponent(name)}`}
      className="flex flex-col items-center p-3 rounded-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-sm font-medium text-center">{name}</h3>
      <p className="text-xs text-gray-500">{count} Available</p>
    </Link>
  );
};

export default CategoryCard;
