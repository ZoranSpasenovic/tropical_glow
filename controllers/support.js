const { text } = require("express");
const nodemailer = require("nodemailer");
const getCartCount = require("../helpers/getCartCount");

const getTermsConditionsPage = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("terms_conditions", {
    pageTitle: "Uslovi koriscenja Tropical Glow",
    cssFiles: ["/css/terms.css", "/css/contactForm.css"],
    jsFiles: [],
    cartCount,
    path: "",
  });
};

const getPrivacyPolicyPage = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("privacy_policy", {
    pageTitle: "Politika Privatnosti Tropical Glow",
    cssFiles: ["/css/privacyPolicy.css", "/css/contactForm.css"],
    jsFiles: [],
    cartCount,
    path: "",
  });
};

const sendMessage = async (req, res, next) => {
  const { name, last_name, email, message } = req.body;

  if (!name || !last_name || !email || !message) {
    res.status(400).json({ message: "sva polja su obavezna !" });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "spalespasenovic@gmail.com",
      pass: "ivmd zsuj qhhz wwkj",
    },
  });
  const mailOptions = {
    from: email,
    to: "spalespasenovic@gmail.com",
    subject: `Nova poruka od ${name} ${last_name}`,
    text: `Primili ste novu poruku od korisnika " ${name} ${last_name} ", poruka glasi : "${message}", odgovor na ovu poruku mozete poslati na email adresu : ${email} `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("email sent");
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
};

module.exports = { getTermsConditionsPage, sendMessage, getPrivacyPolicyPage };
