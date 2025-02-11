const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

const { getCheckoutPage, createOrder } = checkoutController;

router.get("/checkout", getCheckoutPage);
router.post("/checkout", createOrder);

module.exports = router;
