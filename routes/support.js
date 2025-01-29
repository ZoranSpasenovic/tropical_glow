const express = require("express");

const {
  getTermsConditionsPage,
  sendMessage,
  getPrivacyPolicyPage,
} = require("../controllers/support");

const router = express.Router();
router.get("/uslovi_koriscenja", getTermsConditionsPage);
router.get("/politika_privatnosti", getPrivacyPolicyPage);
router.post("/podrska/user-question", sendMessage);
module.exports = router;
