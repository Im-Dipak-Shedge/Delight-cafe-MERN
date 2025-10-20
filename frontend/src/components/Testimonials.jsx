import React, { useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dipak ",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.bgqjeKnnWrUTn7Qtlu6HJQHaHa?pid=Api&P=0&h=220",
    rating: 5,
    text: "My go-to cafe! The staff is friendly, and the food is outstanding. Their pastries are a dream, and I can’t get enough of their sandwiches. Definitely worth a visit!",
  },
  {
    name: "Shubham ",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "A little slice of heaven! The ambiance is perfect, the pastries are delicious, and the coffee is strong and flavorful. I’ll definitely be back!",
  },
  {
    name: "Sakshi",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    text: "Food is fresh, the portions are generous, and the staff is super friendly. I love how easy it is to grab something when I’m in a rush. Highly recommended!",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(1);

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  return (
    <div className="bg-[#f8f5ef] py-16 px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-10">
        What our visitors say about us
      </h2>

      <div className="flex justify-center gap-6 overflow-hidden">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: index === current ? 1 : 0.5, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-sm p-6 bg-white rounded-2xl shadow-md transition-all duration-300 ${
              index === current ? "scale-105" : "hidden md:block opacity-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <div className="text-yellow-500">
                  {"★".repeat(testimonial.rating)}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {testimonial.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-10 h-[2px] cursor-pointer transition-all duration-300 ${
              current === index ? "bg-black h-[3px]" : "bg-gray-400"
            }`}
          ></div>
        ))}
        <span className="ml-4 font-semibold">
          {current + 1 < 10 ? `0${current + 1}` : current + 1}
        </span>
      </div>
    </div>
  );
}
