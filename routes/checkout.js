const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

const { getCheckoutPage, createOrder, testingEmail } = checkoutController;

router.get("/checkout", getCheckoutPage);
router.post("/checkout", createOrder);
router.get("/test", testingEmail);

module.exports = router;
