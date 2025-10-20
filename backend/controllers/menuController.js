const MenuItem = require("../models/menu-model");

const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find();

        const itemsWithImage = items.map((item) => {
            return {
                ...item._doc,
                image: item.image || "",
            };
        });

        res.status(200).json(itemsWithImage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching menu items" });
    }
};



// Add a new menu item (for admin use later)
const addMenuItem = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // 🔍 Check if item already exists (case-insensitive, ignoring category)
        const existingItem = await MenuItem.findOne({
            name: { $regex: new RegExp("^" + name + "$", "i") },
        });

        if (existingItem) {
            return res
                .status(400)
                .json({ message: "This item already exists in the menu" });
        }

        // ✅ Convert buffer to base64 string
        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        // ✅ Create new menu item with base64 image
        const newItem = new MenuItem({
            name,
            category,
            price,
            description,
            image: `data:${mimeType};base64,${base64Image}`,
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error adding menu item" });
    }
};


const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        const { name, category, price, description } = req.body;
        item.name = name || item.name;
        item.category = category || item.category;
        item.price = price || item.price;
        item.description = description || item.description;

        if (req.file) {
            item.image.data = req.file.buffer;
            item.image.contentType = req.file.mimetype;
        }

        await item.save();
        res.status(200).json(item);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error updating menu item" });
    }
};

// @desc Delete a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error deleting menu item" });
    }
};

const getBestSellers = async (req, res) => {
    try {
        const items = await MenuItem.find().sort({ soldCount: -1 }).limit(6);
        res.status(200).json({ success: true, items });
    } catch (err) {
        console.error("error fetching best-sellers", err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}



module.exports = {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getBestSellers
};

