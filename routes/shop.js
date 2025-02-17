const express = require("express");

const storeControllers = require("../controllers/store");
const {
  getHomePage,
  getBlog,
  getProductsPage,
  getProductDetails,
  getSkinConcernPage,
  getBlogDetails,
  getSearchPage,
  getAllProducts,
} = storeControllers;

const router = express.Router();

router.get("/", getHomePage);

router.get("/blog", getBlog);

router.get("/blog/:blogId", getBlogDetails);

router.get("/skin_concern/:ctg", getSkinConcernPage);

router.get("/proizvodi", getAllProducts);

router.get("/proizvodi/:ctg", getProductsPage);

router.get("/proizvod/:slug", getProductDetails);

router.get("/search", getSearchPage);

module.exports = router;
