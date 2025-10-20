import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/cartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiSquareRemove } from "react-icons/ci";
import { loadRazorpay } from "../utils/loadRazorpay";

const CartPage = () => {
  const { cartItems, fetchCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, qty) => {
    if (qty < 1) return;
    await updateQuantity(productId, qty);
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const safeCartItems = Array.isArray(cartItems)
    ? cartItems.filter((item) => item && item.product)
    : [];

  const subtotal = safeCartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const taxes = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + taxes;

  const handleCheckout = async () => {
    if (safeCartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      setLoadingCheckout(true);

      // 1️⃣ Create Razorpay order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-order`,
        { amount: total },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "DelightCafe Billing",
        description: "Order Payment",
        handler: async function (response) {
          try {
            // 2️⃣ Verify payment and create order
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: safeCartItems.map((item) => ({
                  product: item.product?._id,
                  quantity: item.quantity,
                })),
                totalPrice: total,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              alert("Payment successful! Order created.");
              fetchCart();
              navigate("/orders");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Server error while verifying payment");
          }
        },
        theme: { color: "#5C4033" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong during checkout!");
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (safeCartItems.length === 0) {
    return (
      <div className="max-w-7xl h-64 mx-auto p-4 md:p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Shopping Cart
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Items</th>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total</th>
              <th className="p-3">Remove</th>
            </tr>
          </thead>
          <tbody>
            {safeCartItems.map((item) => (
              <tr
                key={item.product?._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{item.product?.name || "Unknown Item"}</td>
                <td className="p-3">{formatPrice(item.product?.price || 0)}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={item.quantity || 1}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product?._id,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="p-3 font-medium">
                  {formatPrice(
                    (item.product?.price || 0) * (item.quantity || 0)
                  )}
                </td>
                <td
                  className="p-3 sm:pl-8 pl-6 cursor-pointer text-red-500 font-bold"
                  onClick={() => handleRemove(item.product?._id)}
                >
                  <CiSquareRemove className="text-3xl" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-8 gap-6">
        <div className="bg-gray-50 p-6 rounded w-full md:w-1/3 shadow-md">
          <h2 className="text-xl font-bold mb-4">Cart Totals</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Taxes (5%)</span>
            <span>{formatPrice(taxes)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loadingCheckout}
            className="w-full bg-[#5C4033] text-white py-2 rounded cursor-pointer hover:bg-[#3E2723] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingCheckout ? "Processing..." : "PROCEED TO CHECKOUT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
