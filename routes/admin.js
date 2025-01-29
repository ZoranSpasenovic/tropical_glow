const express = require("express");

const router = express.Router();

const {
  getAdminPage,
  editProduct,
  adminLogin,
  adminAuth,
  adminLogout,
} = require("../controllers/admin");

const checkAdminAuth = (req, res, next) => {
  console.log(req.session);
  if (req.session.isAdmin) {
    return next();
  }
  return res.redirect("/admin/login");
};

router.get("/admin/login", adminLogin);
router.post("/admin/login", adminAuth);
router.get("/admin", checkAdminAuth, getAdminPage);
router.post("/admin/edit-product/:prodId", checkAdminAuth, editProduct);
router.post("/admin/logout", adminLogout);

module.exports = router;
