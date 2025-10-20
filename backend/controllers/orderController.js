const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const MenuItem = require("../models/menu-model")

exports.checkoutOrder = async (req, res) => {

    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const totalPrice = cart.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: req.user._id,
            items: cart.items,
            totalPrice,
            status: "Paid",
        });

        // Increment soldCount for each purchased item
        for (const item of cart.items) {
            const updatedmenu = await MenuItem.findByIdAndUpdate(item.product._id, {
                $inc: { soldCount: item.quantity }, // increment by quantity bought
            });
        }
        // clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.product");

        const ordersWithImages = orders.map(order => {
            const itemsWithImages = order.items.map(item => {
                const product = item.product ? item.product.toObject() : {};

                if (product.image && typeof product.image === "string" && product.image.startsWith("data:")) {
                    // Already valid base64 string, use as is
                    product.image = product.image;
                } else {
                    // Fallback placeholder
                    product.image = null;
                }

                return { ...item.toObject(), product };
            });

            return { ...order.toObject(), items: itemsWithImages };
        });

        res.status(200).json({ success: true, orders: ordersWithImages });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.product");

        const ordersWithImages = orders.map(order => {
            const itemsWithImages = order.items.map(item => {
                const product = item.product ? item.product.toObject() : {};

                if (product.image && typeof product.image === "string" && product.image.startsWith("data:")) {
                    product.image = product.image;
                } else {
                    product.image = null;
                }

                return { ...item.toObject(), product };
            });

            return { ...order.toObject(), items: itemsWithImages };
        });

        res.status(200).json({ success: true, orders: ordersWithImages });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//For admin purpose
exports.getAllOrders = async (req, res) => {
    try {


        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("items.product");

        // Handle deleted products / missing images
        const ordersWithItems = orders.map((order) => {
            const items = order.items.map((item) => {
                const product = item.product ? item.product.toObject() : {};
                return {
                    ...item.toObject(),
                    product: {
                        ...product,
                        name: product.name || "Deleted Product",
                        price: product.price || 0,
                        image: product.image || null,
                    },
                };
            });
            return { ...order.toObject(), items };
        });

        res.status(200).json({ success: true, orders: ordersWithItems });
    } catch (err) {
        console.error("Error fetching admin orders:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

