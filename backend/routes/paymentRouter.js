const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const MenuItem = require("../models/menu-model");
const authMiddleware = require("../middlewares/authMiddleware")

// POST /payment/create-order
router.post("/create-order", authMiddleware, async (req, res) => {
    try {

        const { amount } = req.body; // amount in rupees
        if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({ success: true, order });

    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/verify-payment", authMiddleware, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,       // cart items from frontend
            totalPrice,  // total amount from frontend
        } = req.body;


        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details",
            });
        }

        // Step 1: Verify Razorpay signature
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");


        if (generated_signature !== razorpay_signature) {
            console.log("Payment verification failed!");
            return res.status(400).json({
                success: false,
                message: "Invalid signature, payment failed",
            });
        }

        console.log("Payment verified successfully!");

        // Step 2: Create order in DB
        const order = await Order.create({
            user: req.user._id,
            items: items.map((i) => ({
                product: i.product,
                quantity: i.quantity,
            })),
            totalPrice,
            status: "Paid",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });

        //step 3: increament of soldcount of menuitem

        for (const item of items) {
            if (!item.product || !item.quantity) continue; // if current item is deleted moves to next 
            await MenuItem.findByIdAndUpdate(item.product, {
                $inc: { soldCount: item.quantity },
            });
        }

        // Step 4: Clear user's cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }





        res.status(200).json({
            success: true,
            message: "Payment verified and order created successfully",
            order,
        });
    } catch (err) {
        console.error("Error in payment verification/order creation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;


