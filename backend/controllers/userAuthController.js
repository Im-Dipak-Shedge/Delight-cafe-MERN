const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require('../models/user-model');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) return res.status(409).send("user already exists")

        bcrypt.hash(password, 12, async (err, hash) => {
            if (err) res.send(err)
            else {

                let createdUser = await userModel.create({
                    fullname, email, password: hash
                })
                let token = generateToken(createdUser);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none", // important for cross-origin cookies
                    maxAge: 5 * 24 * 60 * 60 * 1000
                });

                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                });
            }
        })

    }
    catch (err) {
        res.send(err.message);
    }


}


module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) return res.status(401).send("you need to register first")
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    let token = generateToken(user);
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: true, // true in production with HTTPS
                        sameSite: "none", // important for cross-origin cookies
                        maxAge: 5 * 24 * 60 * 60 * 1000
                    });
                    res.status(200).json({
                        success: true,
                        message: "Login successful",
                        user: { id: user._id, fullname: user.fullname, email: user.email },
                    });
                }
                else return res.status(409).send("Invalid credentials");
            });
        }
    }
    catch (err) {
        res.send(err.message);
    }
}

module.exports.logoutUser = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
