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
app.use(helmet());

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const supportRoutes = require("./routes/support");
const checkoutRoutes = require("./routes/checkout");
const sitemapRoutes = require("./routes/sitemap");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));

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

app.use((req, res, next) => {
  res.locals.version = "1.0.2";
  next();
});

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
