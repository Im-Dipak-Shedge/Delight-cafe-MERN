import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ListItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const categories = ["Desserts", "Food", "Drinks"];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/menu`);
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/menu/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/menu/${editItem._id}`, {
        description: editItem.description,
        category: editItem.category,
        price: editItem.price,
      });
      alert("Item updated successfully!");
      setEditItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Error updating item!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading menu items...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-black">All Foods List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700 text-sm font-medium">
                Image
              </th>
              <th className="px-4 py-3 text-left text-gray-700 text-sm font-medium">
                Name
              </th>
              <th className="px-4 py-3 text-left text-gray-700 text-sm font-medium">
                Category
              </th>
              <th className="px-4 py-3 text-left text-gray-700 text-sm font-medium">
                Price
              </th>
              <th className="px-4 py-3 text-left text-gray-700 text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr
                key={item._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.category}</td>
                <td className="px-4 py-3 text-gray-600">
                  {formatPrice(item.price)}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => setEditItem({ ...item })}
                    className="rounded-md bg-blue-500 py-1 px-5 hover:bg-blue-600 text-white font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-md bg-red-500 py-1 px-3 hover:bg-red-600 text-white font-semibold"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Popup */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#d4a373] w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold text-[#2c1810] mb-6 text-center">
              Edit Menu Item
            </h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-[#2c1810] font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editItem.name}
                  disabled
                  className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed text-[#2c1810]"
                />
              </div>

              <div>
                <label className="block text-[#2c1810] font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  rows="3"
                  className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2c1810] font-semibold mb-2">
                    Category
                  </label>
                  <select
                    value={editItem.category}
                    onChange={(e) =>
                      setEditItem({ ...editItem, category: e.target.value })
                    }
                    className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#2c1810] font-semibold mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({ ...editItem, price: e.target.value })
                    }
                    className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-5 py-2 rounded-lg border border-[#b07f4b] text-[#2c1810] hover:bg-[#f5f0eb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#462517] text-white hover:bg-[#2c1810]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
