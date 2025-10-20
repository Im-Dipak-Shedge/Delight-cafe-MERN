import { FaStar } from "react-icons/fa";
import { assets } from "./../assets/assets";
import Testimonials from "../components/Testimonials";

export default function About() {
  return (
    <div>
      <div className="sm:mt-10 pl-[5%]">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 px-6 md:px-20 py-6">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left ">
            <h2 className="sm:text-5xl text-3xl font-semibold text-gray-900 mb-6">
              About Us
            </h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              There's more to Cafe Carolina than great food. Youll feel it the
              moment you walk in the door. Its a place to share laughter,
              conversation and friendship, over a warm panini, a frothy latte or
              a fresh-baked muffin. Its a place to grab a quick bite or to enjoy
              a leisurely lunch. Most of all, its a neighborhood place where you
              can relax and feel at home.
            </p>
            <button className="flex items-center gap-2 px-5 py-2 border border-gray-400 rounded-full hover:bg-gray-200 transition cursor-pointer">
              Learn more
              <span className="text-lg">→</span>
            </button>
          </div>
          {/* Right Image */}
          <div className="flex justify-center w-fit mt-8 md:mt-0">
            <img
              src={assets.coffeecup}
              alt="Coffee cup"
              className="w-[100%] rotate-10"
            />
          </div>
        </div>
      </div>
      <Testimonials />
    </div>
  );
}
