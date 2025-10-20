import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import About from "./About";
import BestSellers from "../components/BestSellers";
import { IoLeafOutline } from "react-icons/io5";
import { BsCupHot } from "react-icons/bs";
import { MdOutlineMenuBook } from "react-icons/md";
import { RiCake3Line } from "react-icons/ri";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Fresh Goodness",
      desc: "Crafted from scratch with fresh, locally sourced ingredients for unmatched taste and quality.",
      icon: <IoLeafOutline />,
    },
    {
      title: "Cozy Atmosphere",
      desc: "Enjoy a warm, cozy space, perfect for relaxing and enjoying a pleasant meal.",
      icon: <BsCupHot />,
    },
    {
      title: "Easy Ordering",
      desc: "Craving comfort food? Order your favorite dishes with easy interactions.",
      icon: <MdOutlineMenuBook />,
    },
    {
      title: "Tasty Variety",
      desc: "From savory bites to sweet treats, we have something for every taste preference.",
      icon: <RiCake3Line />,
    },
  ];

  return (
    <div className="bg-[#FCFAF4] sm:pt-0 pt-20 ">
      <div className="flex justify-center sm:py-4 relative">
        {/* Left Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-extrabold flex flex-col sm:text-6xl absolute z-10 sm:left-[265px] text-3xl sm:top-1/5 -translate-y-1/2 top-[-10px] left-8"
        >
          SMELLS LIKE
          <span className="mt-2">HOME</span>
        </motion.div>

        {/* Center Image */}
        <motion.img
          src={assets.hero_img}
          className="sm:w-[450px] w-3/4 bg-transparent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0], // floating effect
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Right Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="font-extrabold flex flex-col items-end sm:text-6xl text-3xl absolute sm:right-[270px] sm:bottom-1/12 bottom-[-22%]  right-[9%] -translate-y-1/2"
        >
          TASTES LIKE
          <span className="mt-2">HEAVEN</span>
        </motion.div>
      </div>
      <span className="absolute  sm:top-2/4 text-justify sm:w-[24%] sm:left-[13%] sm:text-lg text-sm w-[60%] left-[5%] bottom-[17%]">
        Warm aromas, fresh-baked delights, and handcrafted coffee-your cozy
        escape for sweet moments and savory cravings!
      </span>

      {/* scrolldown button */}
      <div
        className="absolute sm:-bottom-1 sm:left-1/4 bottom-5 right-1/11 cursor-pointer"
        onClick={() => {
          const startY = window.scrollY; // where we are now
          const targetY = startY + window.innerHeight; // one screen down
          const duration = 1000; // 1 second
          const startTime = performance.now();

          const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeInOutCubic for smooth effect
            const ease =
              progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startY + (targetY - startY) * ease);

            if (elapsed < duration) {
              requestAnimationFrame(animateScroll);
            }
          };

          requestAnimationFrame(animateScroll);
        }}
      >
        <div className="parent relative h-30 w-30 sm:w-48 sm:h-48 flex items-center justify-center">
          {/* Circular Text */}
          <div className="absolute w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text fontSize="9" fill="#1F2937" fontWeight="500">
                <textPath href="#circlePath" startOffset="0" textLength="216">
                  Scroll Down Scroll Down Scroll Down
                </textPath>
              </text>
            </svg>
          </div>

          {/* Black Circle */}
          <img
            src={assets.scrolldown}
            className="child absolute w-20 h-20 duration-150 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
          >
            {/* Down Arrow */}
          </img>
        </div>
      </div>

      {/* ----------------- Bestseller Component ---------------- */}
      <BestSellers />

      {/* ----------------- Features Section ---------------- */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {features.map((f, i) => (
            <div key={i}>
              <div className="text-5xl flex justify-center mb-4 ">{f.icon}</div>
              <h4 className="font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- Book a Table Section ---------------- */}
      <section className="relative h-[350px] flex items-center justify-center text-center text-white px-6">
        <div className="bg-black bg-opacity-50 p-8 rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Book a Table</h3>
          <p className="mb-6 text-sm md:text-base">
            Want to enjoy a meal in comfort? Book your table now and enjoy our
            delicious dishes.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2">
            Reserve now
          </button>
        </div>
      </section>

      {/* ABoutsection */}
      <About />
    </div>
  );
};
export default Home;
