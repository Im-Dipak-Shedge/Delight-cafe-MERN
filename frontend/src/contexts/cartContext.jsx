import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Standardize response so cartItems is always `items`
  const normalizeCart = (res) => {
    if (!res || !res.data) return [];
    return res.data.items || res.data; // handle both formats
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart", { withCredentials: true });
      setCartItems(normalizeCart(res));
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    }
  };

  const addToCart = async (item) => {
    if (!user) {
      alert("You need to login first");
      return navigate("/login");
    }

    try {
      const res = await api.post(
        "/cart",
        {
          productId: item._id, // ✅ send productId
          quantity: 1, // ✅ default to 1
        },
        { withCredentials: true }
      );

      // assuming your backend responds with { cart }

      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error("Add to Cart Error:", err.response?.data || err.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`, {
        withCredentials: true,
      });
      setCartItems(normalizeCart(res));
    } catch (err) {
      console.error("Remove from Cart Error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(
        "/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      setCartItems(normalizeCart(res));
    } catch (err) {
      console.error("Update Quantity Error:", err);
    }
  };

  useEffect(() => {
    if (!loading) fetchCart();
  }, [user, loading]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
