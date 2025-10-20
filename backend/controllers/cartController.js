const Cart = require("../models/cart-model");
const MenuItem = require("../models/menu-model");

// Get all cart items (no user required)

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        res.status(200).json(cart || { items: [] });
    } catch (err) {
        console.error("Get Cart Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (i) => i.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();

        // ✅ Populate before sending back
        const populatedCart = await cart.populate("items.product");

        res.status(200).json({ success: true, cart: populatedCart });
    } catch (err) {
        console.error("Add to Cart Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


// Update item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            (i) => i.product.toString() === productId
        );
        if (itemIndex > -1) cart.items[itemIndex].quantity = quantity;

        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart.items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (i) => i.product.toString() !== productId
        );
        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart.items);

    } catch (err) {
        console.error("Remove Item Error:", err);
        res.status(500).json({ message: err.message });
    }
};
