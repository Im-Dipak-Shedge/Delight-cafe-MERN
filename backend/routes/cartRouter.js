const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/", authMiddleware, getCart);
router.put("/", authMiddleware, updateQuantity);
router.delete("/:productId", authMiddleware, removeFromCart);
router.post("/", authMiddleware, addToCart);
module.exports = router;
