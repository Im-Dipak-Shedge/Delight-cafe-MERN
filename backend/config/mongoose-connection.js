
//command to use debug  $env:DEBUG="development:*" & Remove-Item Env:DEBUG

const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
require("dotenv").config();

// ✅ Use environment variable or fallback to local
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("mongodb connected")
        debug("✅ Connected to MongoDB successfully")
    })

    .catch((err) => {
        console.log("mongodb not connected", err)

        debug(`❌ MongoDB connection error: ${err.message}`)
    });


module.exports = mongoose.connection;
