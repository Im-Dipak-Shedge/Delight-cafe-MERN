const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ["Drinks", "Food", "Desserts"], required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: {
        type: String
    },
    soldCount: {
        type: Number,
        default: 0, // starts at zero
    },
});


module.exports = mongoose.model("MenuItem", menuItemSchema, "menu");
