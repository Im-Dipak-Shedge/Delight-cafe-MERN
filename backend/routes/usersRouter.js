const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require('../models/user-model');
const { registerUser, loginUser, logoutUser } = require('../controllers/userAuthController');

router.get("/", (req, res) => {
    res.send("hey its a users Router");
})

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router