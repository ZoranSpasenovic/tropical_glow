const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { addToCart, getCartPage, updateCart } = cartController;

router.post("/add-to-cart", addToCart);

router.post("/update-cart", updateCart);

router.get("/korpa", getCartPage);

module.exports = router;
