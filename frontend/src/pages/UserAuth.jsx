import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { assets } from "../assets/assets";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // State for form values
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(
          // "http://localhost:3000/users/login",
          `${import.meta.env.VITE_API_URL}/users/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true } // important if using cookies
        );

        if (res.data.success) {
          login(res.data.user); //store the user info in the context
          navigate("/"); // redirect after login
        }
      } else {
        const res = await axios.post(
          // "http://localhost:3000/users/register",
          `${import.meta.env.VITE_API_URL}/users/register`,
          formData,
          { withCredentials: true }
        );

        if (res.data.success) {
          navigate("/login"); // redirect after register
          setIsLogin(true); // switches UI to login form
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAF4] px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-800"
        >
          <IoMdClose size={28} />
        </button>

        {/* Left Side - Illustration / Branding */}
        <div className="hidden md:flex w-1/2 relative rounded-l-2xl overflow-hidden">
          <img
            src={assets.bglogin}
            alt="Cafe branding"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex items-center justify-center w-full">
            <h2 className="text-4xl font-extrabold text-white text-center leading-snug px-6">
              Delight Cafe <br /> Awaits You ☕
            </h2>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#3E2C17] mb-6 text-center">
            {isLogin ? "Welcome Back" : "Join Delight Cafe"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#C68642]"
              />
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#C68642]"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border rounded-lg bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#C68642]"
            />

            <button
              type="submit"
              className="w-full py-3 bg-[#3E2C17] text-white font-semibold rounded-lg hover:bg-[#2A1D10] transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Switch Between Login & Register */}
          <p className="mt-6 text-center text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#C68642] font-semibold hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#C68642] font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
