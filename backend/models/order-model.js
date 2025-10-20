const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },

    // Just order progress (since payment is guaranteed before creation)
    status: {
      type: String,
      enum: ["Paid", "Preparing", "Served", "Cancelled"],
      default: "Paid",
    },

    // Optional: save Razorpay IDs for tracking
    paymentId: { type: String },
    orderId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
