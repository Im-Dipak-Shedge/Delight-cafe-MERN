import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { IoFastFoodOutline, IoMenu, IoLogOutOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/cartContext";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";

import axios from "axios";
const Navbar = () => {
  const [menuVisible, setmenuVisible] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  //logout
  const handlelogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <div className="flex bg-[#FCFAF4] z-50 justify-between items-center sm:px-13 px-5">
      <img src={assets.logo} className="sm:w-48 w-40" />

      <ul className="hidden sm:flex font-semibold text-gray-900 gap-12 ">
        <NavLink to="/" className="flex-col items-center gap-1 flex ">
          <p>Home</p>
          <hr className="border-none h-[1.5px] w-2/4 bg-gray-500 hidden" />
        </NavLink>
        <NavLink to="/menu" className="flex-col items-center gap-1 flex ">
          <p>Menu</p>
          <hr className="border-none h-[1.5px] w-2/4 bg-gray-500 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex-col items-center gap-1 flex ">
          <p>About Us</p>
          <hr className="border-none h-[1.5px] w-2/4 bg-gray-500 hidden" />
        </NavLink>
        <NavLink to="/orders" className="flex-col items-center gap-1 flex ">
          <p>Orders</p>
          <hr className="border-none h-[1.5px] w-2/4 bg-gray-500 hidden" />
        </NavLink>

        <Link
          to={"/admin/login"}
          className="rounded-2xl hover:scale-105 cursor-pointer border-gray-700 border px-4 py-[5px] text-[12px] font-semibold flex justify-center items-center bg-gray-800 text-white"
        >
          Admin Panel
        </Link>
      </ul>

      <div className="flex gap-x-5 sm:gap-x-10 items-center">
        <Link to={"/cart"} className="relative cursor-pointer">
          <IoFastFoodOutline className="text-[26px] " />
          <p className="bg-black absolute text-white rounded-full font-medium text-[8px] aspect-square w-4 text-center leading-4 top-[13px] left-[14px]">
            {user ? cartItems.length : 0}
          </p>
        </Link>

        {/* the sign in button  */}
        {user ? (
          // Show user info if logged in
          <div className="sm:flex sm:items-center hidden sm:gap-3">
            <CgProfile className="text-xl" />
            <span className="font-semibold">{user.fullname}</span>
            <button
              onClick={handlelogout}
              className="rounded-2xl cursor-pointer border px-4 py-1 text-sm font-semibold text-red-600 hover:bg-gray-100 flex items-center gap-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to={"/login"}
            className="rounded-2xl sm:flex hidden cursor-pointer text-gray-800 border-gray-600 border px-6 text-[14px] hover:bg-gray-100 font-semibold justify-center items-center py-[6px] "
          >
            sign in
          </Link>
        )}

        <IoMenu
          onClick={() => {
            setmenuVisible(true);
          }}
          className={"text-[35px] mt-[6px] sm:hidden cursor-pointer"}
        />
      </div>
      {/* Hamburger menu */}

      <div
        className={`bg-white absolute z-50 text-gray-600 transition-all  top-0 overflow-hidden right-0 bottom-0 ${
          menuVisible ? "w-full" : "w-0"
        }`}
      >
        <div className="HamburgerList flex flex-col font-semibold">
          <div
            onClick={() => setmenuVisible(false)}
            className=" font-semibold flex border-b border-gray-300 items-center gap-4 text-[17px] p-3 "
          >
            <IoIosArrowBack className="text-3xl" />

            {user ? (
              <div className="flex gap-2   w-full items-center justify-end text-xl ">
                <CgProfile className="text-xl" /> {user.fullname}
              </div>
            ) : (
              <div className="flex gap-2 text-red-400 w-full items-center justify-end text-lg ">
                <CgProfile className="text-xl" /> user not found
              </div>
            )}
          </div>

          <NavLink
            onClick={() => setmenuVisible(false)}
            to="/"
            className="border-b border-gray-300 pl-6 py-3"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setmenuVisible(false)}
            to="/menu"
            className="border-b border-gray-300  pl-6 py-2"
          >
            MENU
          </NavLink>
          <NavLink
            onClick={() => setmenuVisible(false)}
            to="/orders"
            className="border-b border-gray-300  pl-6 py-2"
          >
            ORDERS
          </NavLink>

          <NavLink
            onClick={() => setmenuVisible(false)}
            to="/about"
            className="border-b border-gray-300 pl-6 py-2"
          >
            ABOUT US
          </NavLink>

          <Link
            to={"/admin/login"}
            className=" py-2 px-6 text-start text-gray-700 hover:text-black "
          >
            ADMIN PANEL
          </Link>

          {user ? (
            <button
              onClick={() => {
                handlelogout();
                setmenuVisible(false);
              }}
              className="border-b flex gap-3 text-red-600 items-center border-gray-300  pl-6 py-2"
            >
              <IoLogOutOutline className=" text-[22px] " />
              <p>LOGOUT </p>
            </button>
          ) : (
            <NavLink
              onClick={() => setmenuVisible(false)}
              to="/login"
              className="border-b flex gap-3 text-blue-500  items-center border-gray-300  pl-6 py-2"
            >
              <p>SIGN IN</p>
              <IoLogOutOutline className=" text-[22px] " />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
