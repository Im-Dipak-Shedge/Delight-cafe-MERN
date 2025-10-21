import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../contexts/cartContext";

const BestSellers = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Adjust items per slide based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setItemsPerSlide(1); // Mobile phones: 1 card
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Tablets: 2 cards
      } else {
        setItemsPerSlide(3); // Desktop: 3 cards
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch best sellers
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/menu/best-sellers`
        );
        if (res.data.success) setProducts(res.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Split products into slides
  const slides = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    slides.push(products.slice(i, i + itemsPerSlide));
  }

  const totalSlides = slides.length;

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  const handleNext = () =>
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? prev : prev + 1));

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <section className="py-16 px-4 sm:mt-28 mt-[70%]  md:px-10">
      <div className="max-w-6xl p-5 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#4b2e05]">Our Bestsellers</h2>
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 border border-[#4b2e05] text-[#4b2e05] rounded-full sm:px-5 sm:py-2 px-3 py-1 hover:bg-[#4b2e05] hover:text-white transition"
          >
            See all <FaArrowRight className="h-3 sm:h-[18px]" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex py-3 transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="flex gap-4 flex-shrink-0 w-full">
                {slide.map((item) => {
                  const isInCart = cartItems.some(
                    (cartItem) => cartItem?.product?._id === item._id
                  );
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 group flex flex-col"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-[#4b2e05] text-white text-xs px-3 py-1 rounded-full">
                          Bestseller
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-xl font-semibold text-[#4b2e05]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-bold text-[#8b5e34] text-lg">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 shadow-sm ${
                              isInCart
                                ? "bg-[#8a6d60] text-white cursor-not-allowed"
                                : "bg-[#5C4033] text-white cursor-pointer hover:bg-[#715548] shadow-md"
                            }`}
                            disabled={isInCart}
                          >
                            {isInCart ? "Item Added" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Navigation */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#4b2e05] text-white p-3 rounded-full hover:bg-[#6f3d08] disabled:opacity-50"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#4b2e05] text-white p-3 rounded-full hover:bg-[#6f3d08] disabled:opacity-50"
              >
                <FaArrowRight />
              </button>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 w-8 rounded-full cursor-pointer ${
                currentSlide === index ? "bg-[#4b2e05]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
