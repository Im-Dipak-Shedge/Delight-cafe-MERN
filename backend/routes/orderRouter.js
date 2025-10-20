const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// User checkout
router.post("/checkout", authMiddleware, orderController.checkoutOrder);
// User orders
router.get("/my-orders", authMiddleware, orderController.getMyOrders);

//Admin order managements
router.get("/", orderController.getAllOrders);
//Admin status change of order
router.patch("/:orderId/status", orderController.updateOrderStatus);
module.exports = router;
