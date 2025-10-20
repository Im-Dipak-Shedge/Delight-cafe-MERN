const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");


module.exports = async (req, res, next) => {

    if (!req.cookies.token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
