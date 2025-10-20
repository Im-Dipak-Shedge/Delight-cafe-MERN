import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Check if admin is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (admin.username === "admin" && admin.password === "12345") {
      localStorage.setItem("isAdminLoggedIn", true);
      alert("☕ Welcome back, Admin!");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f3] via-[#f7f2eb] to-[#fff] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/80 backdrop-blur-md border border-[#d4b692]/40 shadow-xl rounded-2xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-extrabold text-center mb-2 text-[#8b4513]">
          Delight Café Admin
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Manage your café operations efficiently ☕
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={admin.username}
              onChange={handleChange}
              placeholder="Enter your admin username"
              className="w-full bg-[#fafafa] border border-gray-300 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c28f47] transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={admin.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-[#fafafa] border border-gray-300 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c28f47] transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium animate-pulse">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#f9d29d] to-[#f2b45e] text-[#4b2e05] font-semibold py-3 rounded-xl shadow-md hover:shadow-[#f2b45e]/30 transition-all duration-300"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Delight Café Management System
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
