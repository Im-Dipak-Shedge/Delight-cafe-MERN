const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getBestSellers
} = require("../controllers/menuController");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", getMenuItems);
router.post("/", upload.single("image"), addMenuItem); // handle image upload
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.get("/best-sellers", getBestSellers)
module.exports = router;
