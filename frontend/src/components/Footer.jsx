// Footer.jsx
import React from "react";
import { FaFacebookF, FaPinterestP } from "react-icons/fa";
import { RxTwitterLogo } from "react-icons/rx";
import { assets } from "../assets/assets"; // Your logo here

export default function Footer() {
  return (
    <footer className="border-t border-gray-400 text-gray-800 sm:pl-[6%] sm:p-0 py-2">
      <div className=" sm:w-2/3 pb-10 sm:pt-5 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Left Section */}
          <div className="flex flex-col items-start md:items-start gap-3 md:w-[30%]">
            <div className="flex items-center gap-2">
              <img
                src={assets.logo}
                alt="Logo"
                className="sm:w-[50%] w-[85%] sm:mb-0 mb-5 h-auto"
              />
            </div>

            {/* For mobile, Working Hours comes under logo */}
            <div className="block  md:hidden mb-4">
              <h2 className="font-bold">Working Hours</h2>
              <div className="flex gap-5">
                <div>
                  <p>Monday to Saturday:</p>
                  <p className="font-bold">7:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <p>Sunday:</p>
                  <p className="font-bold">8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <p className=" leading-relaxed text-gray-800 max-w-xs md:block hidden">
              2005, Delight Cafe and Bakery has been your neighborhood cafe. A
              warm, welcoming place in a friendly, upscale setting.
            </p>

            <p className="font-medium">+380 XX XX XX XXX</p>

            <div className="flex items-center gap-5 text-xl">
              <RxTwitterLogo />
              <FaFacebookF />
              <FaPinterestP />
            </div>
          </div>

          {/* Middle Section - Quick Links (Only desktop) */}
          <div className="hidden md:block">
            <h2 className="font-bold mb-3">Quick Links</h2>
            <ul className="space-y-1">
              <li>Home</li>
              <li>Menu</li>
              <li>Catering</li>
              <li>About Us</li>
              <li>Location</li>
            </ul>
          </div>

          {/* Middle Section - Working Hours (Desktop) */}
          <div className="hidden md:block">
            <h2 className="font-bold mb-3">Working Hours</h2>
            <p>Monday to Saturday:</p>
            <p className="font-bold mb-2">7:00 AM - 8:00 PM</p>
            <p>Sunday:</p>
            <p className="font-bold">8:00 AM - 6:00 PM</p>
          </div>
        </div>
        <img
          src={assets.footerlogo}
          className="sm:w-[10%] rotate-5 w-[20%] absolute end-10 bottom-7 sm:-end-100"
        />
      </div>
    </footer>
  );
}
