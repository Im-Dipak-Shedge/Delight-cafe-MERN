import React, { useEffect, useState } from "react";
import axios from "axios";

const statusStyles = {
  Paid: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Served: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};

// 💎 Status Badge Component
const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles.default;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${style} shadow-sm`}
    >
      {status}
    </span>
  );
};

// 🍰 Order Item Component
const OrderItem = ({ item, formatPrice }) => {
  const product = item?.product || {};
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-none">
      <div className="flex items-center gap-3">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name || "Item"}
          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md border"
        />
        <div>
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
            {product.name || "Unknown Item"}
          </h3>
          <p className="text-gray-600 text-xs mt-0.5">
            {item.quantity} × {formatPrice(product.price || 0)}
          </p>
        </div>
      </div>
      <p className="font-semibold text-gray-900 text-sm sm:text-base">
        {formatPrice((product.price || 0) * (item.quantity || 0))}
      </p>
    </div>
  );
};

// ☕ Single Order Card Component
const OrderCard = ({ order, formatPrice }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 sm:p-6 border border-gray-100">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-3">
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <h2 className="font-bold text-gray-800 text-sm sm:text-base">
            #{order._id.slice(-8).toUpperCase()}
          </h2>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <OrderItem key={item._id} item={item} formatPrice={formatPrice} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No items found in this order.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base">
        <div className="space-y-1">
          <div className="flex justify-between w-44">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between w-44">
            <span className="text-gray-600">Tax (5%)</span>
            <span className="font-semibold">{formatPrice(tax)}</span>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 flex justify-between  sm:w-44">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

// 🌿 Main Orders Component
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          // "http://localhost:3000/orders/my-orders",
          `${import.meta.env.VITE_API_URL}/orders/my-orders`,
          {
            withCredentials: true,
          }
        );
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-sm sm:text-base">
        Loading Orders...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-sm sm:text-base">
        {error}
      </div>
    );
  if (orders.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-sm sm:text-base">
        No Orders Found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br  py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-8">
        My Orders
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} formatPrice={formatPrice} />
        ))}
      </div>
    </div>
  );
}
