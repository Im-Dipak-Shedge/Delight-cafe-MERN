import React, { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

export default function AddItem() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Desserts");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(assets.Defaultupload);

  const categories = ["Desserts", "Food", "Drinks"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productImage) return alert("Please upload an image!");

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("category", productCategory);
    formData.append("price", productPrice);
    formData.append("image", productImage);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/menu`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      setProductName("");
      setProductDescription("");
      setProductCategory("Desserts");
      setProductPrice("");
      setProductImage(null);
      setImagePreview("/placeholder.png");
    } catch (err) {
      console.error(err);
      alert("Item Already exists");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-2xl border border-[#d4a373]">
        <h2 className="text-3xl font-bold text-[#2c1810] mb-8 text-center">
          Add New Menu Item
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-52 h-52 rounded-2xl overflow-hidden bg-[#f5f0eb] flex items-center justify-center shadow-md border border-[#b07f4b]">
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
            <label className="mt-4 cursor-pointer bg-[#462517] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#2c1810] transition">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <div>
              <label className="block text-[#2c1810] font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Delightful Pasta"
                required
                className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
              />
            </div>

            <div>
              <label className="block text-[#2c1810] font-semibold mb-2">
                Description
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows="4"
                placeholder="Describe the product..."
                required
                className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#2c1810] font-semibold mb-2">
                  Category
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
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
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="e.g., 150"
                  required
                  className="w-full border border-[#b07f4b] px-4 py-3 rounded-lg text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#2c1810] bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#462517] text-white py-3 cursor-pointer rounded-lg font-semibold hover:bg-[#2c1810] transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
