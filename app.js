const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const session = require("cookie-session");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

app.set("view engine", "ejs");

app.use(compression());
app.use();

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const supportRoutes = require("./routes/support");
const checkoutRoutes = require("./routes/checkout");
const sitemapRoutes = require("./routes/sitemap");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cacheOptions = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  setHeaders: function (res, path, stat) {
    const oneDay = 86400;
    const oneMonth = 2592000;

    if (path.endsWith(".css") || path.endsWith(".js")) {
      res.set("Cache-Control", `public, max-age=${oneDay}, must-revalidate`);
    } else if (
      path.endsWith(".jpg") ||
      path.endsWith(".png") ||
      path.endsWith(".webp") ||
      path.endsWith(".gif") ||
      path.endsWith(".mp4")
    ) {
      res.set("Cache-Control", `public, max-age=${oneMonth}, immutable`);
    } else if (path.endsWith(".html") || path.endsWith(".htm")) {
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0"
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");
    }

    res.set("Last-Modified", stat.mtime.toUTCString());
  },
};

app.use(express.static(path.join(__dirname, "public"), cacheOptions));

app.use(
  session({
    name: "cart",
    secret: process.env.SESSION_KEY_CART,
    maxAge: 2 * 1000 * 60 * 60,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Lax",
    },
  })
);
app.use(
  session({
    name: "adminSession",
    secret: process.env.SESSION_KEY_ADMIN,
    maxAge: 2 * 1000 * 60 * 60,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Lax",
    },
  })
);

app.use(shopRoutes);
app.use(adminRoutes);
app.use(cartRoutes);
app.use(supportRoutes);
app.use(checkoutRoutes);
app.use(sitemapRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page is not found </h1>");
});

const server = http.createServer(app);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
