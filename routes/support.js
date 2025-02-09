const express = require("express");

const {
  getTermsConditionsPage,
  sendMessage,
  getPrivacyPolicyPage,
  getContactPage,
} = require("../controllers/support");

const router = express.Router();
router.get("/uslovi_koriscenja", getTermsConditionsPage);
router.get("/politika_privatnosti", getPrivacyPolicyPage);
router.get("/kontakt", getContactPage);
router.post("/podrska/user-question", sendMessage);
module.exports = router;
