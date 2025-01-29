const Product = require("../models/product");
const headings = require("../helpers/skin_concern_headings");
const blogContent = require("../helpers/blog_content");
const sequelize = require("../util/database");

const findByCtg = async (ctg) => {
  try {
    const products = await Product.findAll({
      where: sequelize.where(
        sequelize.fn(
          "JSON_CONTAINS",
          sequelize.col("ctg"),
          JSON.stringify([ctg])
        ),
        1
      ),
    });

    return products;
  } catch (err) {
    console.log(err);
  }
};

const getHomePage = (req, res, next) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  findByCtg("nova_ponuda").then((newProducts) => {
    res.render("homepage", {
      pageTitle: "Tropical Glow",
      path: "home",
      newProducts,
      cartCount,
      cssFiles: [],
      jsFiles: ["/js/testimonial_carousel.js"],
    });
  });
};

const getBlog = (req, res, next) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;

  res.render("blog", {
    pageTitle: "Tropical Glow - Blog",
    path: "blog",
    cssFiles: ["/css/blog.css"],
    jsFiles: [],
    cartCount,
    blogContent,
  });
};
const getBlogDetails = (req, res, next) => {
  const blogId = req.params.blogId;
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  const blogData = blogContent.find((blog) => blog.id === +blogId);

  res.render("blog_details", {
    pageTitle: "Tropical Glow - Proizvodi",
    path: "products",
    blogData,
    cartCount,
    cssFiles: ["/css/blogDetails.css", "/css/contactForm.css"],
    jsFiles: [],
  });
};

const getProductsPage = (req, res, next) => {
  const ctg = req.params.ctg;
  const cartCount = req.session.cart ? req.session.cart.length : 0;

  findByCtg(ctg).then((products) => {
    res.render("products", {
      pageTitle: "Tropical Glow - Proizvodi",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: [],
      search: false,
    });
  });
};

const getSkinConcernPage = (req, res, next) => {
  const ctg = req.params.ctg;
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  findByCtg(ctg).then((products) => {
    res.render("skin_concern", {
      pageTitle: "Rešenje za Svaki Izazov",
      path: "skin-concern",
      image: ctg,
      products,
      header: headings[ctg],
      cartCount,
      cssFiles: [],
      jsFiles: [],
    });
  });
};

const getProductDetails = (req, res, next) => {
  const prodId = req.params.prodId;
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  Product.findByPk(prodId).then((product) => {
    res.render("product", {
      product,
      pageTitle: product.name,
      path: "products",
      cartCount,
      cssFiles: ["/css/product.css"],
      jsFiles: ["/js/product_detail.js"],
    });
  });
};

const getSearchPage = (req, res, next) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  Product.fetchSearch(req.query.query).then((products) => {
    res.render("products", {
      pageTitle: "Tropical Glow - Proizvodi",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: [],
      search: req.query.query,
    });
  });
};

module.exports = {
  getHomePage,
  getBlog,
  getProductsPage,
  getProductDetails,
  getSkinConcernPage,
  getBlogDetails,
  getSearchPage,
};
