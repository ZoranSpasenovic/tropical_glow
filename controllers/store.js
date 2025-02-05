const Product = require("../models/product");
const headings = require("../helpers/skin_concern_headings");
const blogContent = require("../helpers/blog_content");
const sequelize = require("../util/database");
const { Op } = require("sequelize");
const getCartCount = require("../helpers/getCartCount");
const naturalEffects = require("../helpers/natural_effects");

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
  const cartCount = getCartCount(req);
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
  const cartCount = getCartCount(req);

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
  const cartCount = getCartCount(req);
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
  const cartCount = getCartCount(req);

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
  const cartCount = getCartCount(req);
  findByCtg(ctg).then((products) => {
    res.render("skin_concern", {
      pageTitle: "Rešenje za Svaki Izazov",
      path: "skin-concern",
      image: ctg,
      products,
      header: headings[ctg],
      cartCount,
      cssFiles: ["/css/skin_concern.css"],
      jsFiles: [],
    });
  });
};

const getProductDetails = async (req, res, next) => {
  const prodId = req.params.prodId;
  const cartCount = getCartCount(req);
  const product = await Product.findByPk(prodId);
  const naturalIngredients = {};
  product.natural.forEach(
    (item) => (naturalIngredients[item] = naturalEffects[item])
  );

  res.render("product", {
    product,
    pageTitle: product.name,
    path: "products",
    cartCount,
    cssFiles: ["/css/product.css"],
    jsFiles: ["/js/product_detail.js"],
    naturalIngredients,
  });
};

const getAllProducts = (req, res, next) => {
  const cartCount = getCartCount(req);
  Product.findAll().then((products) => {
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

const getSearchPage = async (req, res, next) => {
  const cartCount = getCartCount(req);
  const keyword = req.query.query?.trim();

  if (!keyword) {
    res.redirect("/");
  }
  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { effects: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
    res.render("products", {
      pageTitle: "Tropical Glow - Proizvodi",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: [],
      search: req.query.query,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Došlo je do greške, molimo vas pokušajte ponovo" });
  }
};

module.exports = {
  getHomePage,
  getBlog,
  getProductsPage,
  getProductDetails,
  getSkinConcernPage,
  getBlogDetails,
  getSearchPage,
  getAllProducts,
};
