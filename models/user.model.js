const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    age: Number,
    role: { type: String, default: "seller" }
})

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };