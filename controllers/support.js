const { text } = require("express");
const nodemailer = require("nodemailer");
const getCartCount = require("../helpers/getCartCount");

const getTermsConditionsPage = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("terms_conditions", {
    pageTitle: "Uslovi koriscenja - Tropical Glow",
    cssFiles: ["/css/terms.css", "/css/contactForm.css"],
    jsFiles: ["/js/support.js"],
    cartCount,
    path: "",
    metaDescription: false,
    noIndex: true,
  });
};
const getContactPage = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("contact", {
    pageTitle: "Kontaktirajte nas - Tropical Glow",
    cssFiles: ["/css/contactForm.css", "/css/contact.css"],
    jsFiles: ["/js/support.js"],
    cartCount,
    path: "",
    metaDescription: false,
    noIndex: true,
  });
};

const getPrivacyPolicyPage = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("privacy_policy", {
    pageTitle: "Politika Privatnosti - Tropical Glow",
    cssFiles: ["/css/privacyPolicy.css", "/css/contactForm.css"],
    jsFiles: ["/js/support.js"],
    cartCount,
    path: "",
    metaDescription: false,
    noIndex: true,
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
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_KEY,
    },
  });
  const mailOptions = {
    from: email,
    to: "tropicalglowsrbija@gmail.com",
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

module.exports = {
  getTermsConditionsPage,
  sendMessage,
  getPrivacyPolicyPage,
  getContactPage,
};
