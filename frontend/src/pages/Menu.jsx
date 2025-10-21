import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../contexts/cartContext";
import Loader from "../components/Loader";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Drinks", "Food", "Desserts"];
  const { addToCart, cartItems } = useCart();

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/menu`, {
          withCredentials: true,
        });
        // setMenuItems(Array.isArray(res.data.items) ? res.data.items : []);
        setMenuItems(Array.isArray(res.data) ? res.data.filter(Boolean) : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menu. Please try again later.");
      } finally {
        setLoading(false); // ✅ hide loader
      }
    };
    fetchMenu();
  }, []);

  // Filter by category + search
  const filteredItems = menuItems.filter((item) => {
    if (!item) return false; // Safety check
    const matchesCategory = filter === "All" || item.category === filter;
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <p className="text-center mt-10">Something went wrong. </p>;
  }
  if (menuItems.length === 0)
    return <p className="text-center mt-10">No menu items available.</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-center mb-10 text-[#3E2723]">
        Our Menu
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center w-full">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-72 focus:outline-none focus:ring-[0.5px] focus:ring-[#b3a59f]"
        />

        <div className="flex gap-3 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                filter === cat
                  ? "bg-[#5C4033] text-white shadow-md"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-[#E6D5B8] hover:text-[#3E2723]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center w-full max-w-7xl">
        {filteredItems.map((item) => {
          if (!item) return null; // Safety check

          const isInCart = cartItems.some(
            (cartItem) => cartItem?.product?._id === item._id
          );

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl w-[80%] sm:w-72 h-[26rem] shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name || "Menu item"}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-semibold text-[#3E2723] truncate">
                    {item.name || "Unnamed Item"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.category || "Unknown"}
                  </p>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {item.description || ""}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-[#5C4033] text-lg">
                    {formatPrice(item.price || 0)}
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
    </div>
  );
}
