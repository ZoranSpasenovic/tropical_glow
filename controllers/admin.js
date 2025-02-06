const Product = require("../models/product");
const getCartCount = require("../helpers/getCartCount");

const getAdminPage = (req, res) => {
  const cartCount = getCartCount(req);

  Product.findAll().then((products) => {
    res.render("admin", {
      products,
      pageTitle: "Tropical Glow",
      path: "admin",
      cartCount,
      cssFiles: [],
      jsFiles: [],
    });
  });
};
const editProduct = (req, res, next) => {
  const id = req.params.prodId;

  const {
    price,
    amount,
    sale_price,
    package,
    unit,
    sale_check = false,
  } = req.body;

  Product.update(
    {
      price: +price,
      amount: +amount,
      sale_price: +sale_price,
      sale: sale_check ? true : false,
      package: +package,
      unit: unit,
    },
    {
      where: {
        id: +id,
      },
    }
  )
    .then((result) => console.log("product is updated ! "))
    .catch((err) => console.log(err));
  res.redirect("/admin");
};

const adminLogin = (req, res, next) => {
  const cartCount = getCartCount(req);
  res.render("adminLogin", {
    products: [],
    pageTitle: "Tropical Glow",
    path: "admin",
    cartCount,
    cssFiles: ["/css/adminLogin.css"],
    jsFiles: [],
  });
};
const adminAuth = (req, res, next) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASS) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    res.status(401).send("Sifra je neispravna pokusajte ponovo");
  }
};
const adminLogout = (req, res, next) => {
  req.session.isAdmin = false;
  res.redirect("/");
};

module.exports = {
  getAdminPage,
  editProduct,
  adminLogin,
  adminAuth,
  adminLogout,
};
