const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

const { getCheckoutPage, createOrder, getCheckoutSuccess } = checkoutController;

router.get("/checkout", getCheckoutPage);
router.get("/checkout_success", getCheckoutSuccess);
router.post("/checkout", createOrder);

module.exports = router;
