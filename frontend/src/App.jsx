import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import Home from "./pages/Home";
import UserAuth from "./pages/UserAuth";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import AdminLogin from "./adminui/AdminLogin";
import Admin from "./adminui/Admin";
import NotFound from "./pages/NotFound";

const App = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const hideLayout =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  if (loading) return null; // prevent flicker until user is loaded

  return (
    <div>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <UserAuth />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={user ? <Order /> : <Navigate to="/login" />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Admin />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
