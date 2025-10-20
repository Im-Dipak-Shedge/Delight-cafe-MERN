import React, { useEffect, useState } from "react";
import axios from "axios";

// StatusBadge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Paid: { text: "text-blue-900", bg: "bg-blue-100" },
    Preparing: { text: "text-purple-900", bg: "bg-purple-100" },
    Served: { text: "text-green-900", bg: "bg-green-100" },
    Cancelled: { text: "text-red-900", bg: "bg-red-100" },
    default: { text: "text-blue-900", bg: "bg-blue-100" },
  };
  const config = statusConfig[status] || statusConfig.default;

  return (
    <span
      className={`inline-flex items-center px-7 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} shadow-sm`}
    >
      {status}
    </span>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        withCredentials: true,
      });
      if (res.data.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        ` ${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status.");
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading orders...
      </p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;
  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        No orders found.
      </p>
    );

  return (
    <div className="min-h-screen p-6 ">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">
        Admin Order Management
      </h1>
      <div className="space-y-10">
        {orders.map((order) => {
          const subtotal = order.items.reduce((total, item) => {
            const price = item.product?.price ?? item.price ?? 0;
            const qty = item.quantity ?? 0;
            return total + price * qty;
          }, 0);
          const tax = subtotal * 0.05;
          const total = subtotal + tax;

          return (
            <section
              key={order._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden transition hover:shadow-2xl"
            >
              {/* Header */}
              <header className="p-6 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Order ID
                  </p>
                  <h2 className="text-xl font-bold text-gray-800 mt-1">
                    #{order._id.slice(-8).toUpperCase()}
                  </h2>
                </div>
                <div className="flex items-center  gap-4">
                  <StatusBadge status={order.status} />
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm transition"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Served">Served</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </header>

              {/* Items */}
              <div className="p-6 divide-y divide-gray-200">
                {order.items.map((item) => {
                  const product = item.product || {};
                  const price = product.price ?? item.price ?? 0;
                  const name = product.name ?? item.name ?? "Deleted Item";
                  const qty = item.quantity ?? 0;
                  const imageSrc = product.image ?? "/placeholder.png";

                  return (
                    <div
                      key={item._id}
                      className="flex items-center space-x-6 py-5 first:pt-0 last:pb-0"
                    >
                      <img
                        src={imageSrc}
                        alt={name}
                        className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {name}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {qty} × {formatPrice(price)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatPrice(price * qty)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer Totals */}
              <footer className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row justify-end gap-8 items-end">
                <div className="flex justify-between w-full sm:w-auto text-gray-600 font-medium">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between w-full sm:w-auto text-gray-600 font-medium">
                  <span>Tax (5%):</span>
                  <span className="font-bold">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between w-full sm:w-auto text-gray-600 font-bold">
                  <span>Total:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </footer>
            </section>
          );
        })}
      </div>
    </div>
  );
}
