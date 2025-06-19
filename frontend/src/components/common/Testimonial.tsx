import React from "react";
import { FaStar } from "react-icons/fa";

interface TestimonialProps {
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

const Testimonial = ({ name, image, rating, text, date }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-bold">{name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "text-yellow-400" : "text-gray-300"}
                size={14}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{text}</p>
      <p className="text-xs text-gray-500">{date} by google</p>
    </div>
  );
};

export default Testimonial;
