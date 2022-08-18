const express = require('express');
const productRouter = express.Router();
const { authentication, authorisation } = require("../middlewares/auth");


productRouter.get("/dashboard", authentication, authorisation(["admin"]), async (req, res) => {
    return res.send("Welcome to admin dashboard");
})

productRouter.get("/seller", authentication, authorisation(["admin", "seller"]), async (req, res) => {
    return res.send("Welcome to seller dashboard");
})

module.exports = { productRouter };