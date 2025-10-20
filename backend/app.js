const express = require('express');
const path = require('path');
const cors = require("cors");
const userModel = require('./models/user-model');
const usersRouter = require('./routes/usersRouter');
const menuRouter = require("./routes/menuRouter")
const cartRouter = require("./routes/cartRouter")
const orderRouter = require("./routes/orderRouter")
const paymentRouter = require("./routes/paymentRouter")
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose-connection');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
require("dotenv").config();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies
}));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/menu", menuRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/payment", paymentRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
