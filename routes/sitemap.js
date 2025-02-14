const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const Product = require("../models/product");
const blogData = require("../helpers/blog_content");
const router = express.Router();

let sitemapCache;
router.get("/sitemap.xml", async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  res.header("Content-Security-Policy", "script-src 'none'");

  if (sitemapCache) {
    res.send(sitemapCache);
    return;
  }
  console.log("new sitemap created");

  try {
    const sitemap = new SitemapStream({ hostname: "https://tropicalglow.rs" });

    sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
    sitemap.write({ url: "/proizvodi", changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: "/blog", changefreq: "weekly", priority: 0.8 });

    const products = await Product.findAll();
    products.forEach((product) => {
      sitemap.write({
        url: `/proizvod/${product.id}`,
        changefreq: "weekly",
        priority: 0.8,
      });
    });
    blogData.forEach((blog) => {
      sitemap.write({
        url: `/blog/${blog.id}`,
        changefreq: "weekly",
        priority: 0.8,
      });
    });

    sitemap.end();
    const sm = await streamToPromise(sitemap.pipe(createGzip()));
    sitemapCache = sm;
    res.send(sm);
  } catch (err) {
    console.log("greska");
    res.status(500).send("Sitemap greska");
  }
});

module.exports = router;
