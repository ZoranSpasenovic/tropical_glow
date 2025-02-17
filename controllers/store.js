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
      pageTitle: "Tropical Glow - Prirodna nega kože",
      path: "home",
      newProducts,
      cartCount,
      cssFiles: [],
      jsFiles: ["/js/testimonial_carousel.js"],
      metaDescription:
        "Otkrijte prirodnu lepotu sa Spa Ceylon i TropicalGlow proizvodima za negu kože. Iskoristite snagu azijske kozmetike za glatku, zdravu i blistavu kožu.",
      canonical: "",
    });
  });
};

const getBlog = (req, res, next) => {
  const cartCount = getCartCount(req);

  res.render("blog", {
    pageTitle: "Blog o nezi kože - Tropical Glow",
    path: "blog",
    cssFiles: ["/css/blog.css"],
    jsFiles: ["/js/blog.js"],
    cartCount,
    blogContent,
    metaDescription:
      "Saznajte najnovije savete, vodiče i recenzije o negi kože i prirodnim proizvodima na blogu Tropical Glow. Otkrijte najbolje proizvode za zdravlje i lepotu!",
    canonical: "blog",
  });
};
const getBlogDetails = (req, res, next) => {
  const blogId = req.params.blogId;
  const cartCount = getCartCount(req);
  const blogData = blogContent.find((blog) => blog.id === +blogId);

  res.render("blog_details", {
    pageTitle: `${blogData.title} - Tropical Glow`,
    path: "blog",
    blogData,
    cartCount,
    cssFiles: ["/css/blogDetails.css", "/css/contactForm.css"],
    jsFiles: ["/js/blogDetails.js"],
    metaDescription: blogData.metaDescription,

  });
};

const getProductsPage = (req, res, next) => {
  const ctg = req.params.ctg;
  const cartCount = getCartCount(req);

  findByCtg(ctg).then((products) => {
    res.render("products", {
      pageTitle: "Prirodni kozmetički proizvodi  - Tropical Glow",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: ["/js/products.js"],
      search: false,
      metaDescription:
        "Otkrijte proizvode iz kategorije negovanja kože i tela. Prirodna kozmetika Spa Ceylon i Tropical Glow za zdravlje i lepotu vašeg tela.",
    });
  });
};

const getSkinConcernPage = (req, res, next) => {
  const ctg = req.params.ctg;
  const cartCount = getCartCount(req);
  findByCtg(ctg).then((products) => {
    res.render("skin_concern", {
      pageTitle: "Rešenje za Svaki Izazov - Tropical Glow",
      path: "skin-concern",
      image: ctg,
      products,
      header: headings[ctg],
      cartCount,
      cssFiles: ["/css/skin_concern.css"],
      jsFiles: ["/js/products.js"],
      metaDescription: headings[ctg].meta,
    });
  });
};

const getProductDetails = async (req, res, next) => {
  const prodId = req.params.prodId;
  const cartCount = getCartCount(req);
  const product = await Product.findByPk(prodId);

  const natural = Array.isArray(product.natural)
    ? product.natural
    : JSON.parse(product.natural);
  const naturalIngredients = {};
  natural.forEach((item) => (naturalIngredients[item] = naturalEffects[item]));

  res.render("product", {
    product,
    pageTitle: `${product.name} - Tropical Glow`,
    path: "products",
    cartCount,
    cssFiles: ["/css/product.css"],
    jsFiles: ["/js/product_detail.js"],
    naturalIngredients,
    metaDescription: product.name,
  });
};

const getAllProducts = (req, res, next) => {
  const cartCount = getCartCount(req);
  Product.findAll().then((products) => {
    res.render("products", {
      pageTitle: "Prirodni kozmetički proizvodi  - Tropical Glow",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: ["/js/products.js"],
      search: false,
      metaDescription:
        "Otkrijte proizvode iz kategorije negovanja kože i tela. Prirodna kozmetika Spa Ceylon i Tropical Glow za zdravlje i lepotu vašeg tela.",
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
      pageTitle: "Rezultati pretrage - Tropical Glow",
      path: "products",
      products,
      cartCount,
      cssFiles: [],
      jsFiles: ["/js/products.js"],
      search: req.query.query,
      metaDescription: false,
      noIndex: true,
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
