const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const session = require("cookie-session");
require("dotenv").config();

app.set("view engine", "ejs");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const supportRoutes = require("./routes/support");
const checkoutRoutes = require("./routes/checkout");

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "cart",
    secret: process.env.SESSION_KEY_CART,
    maxAge: 2 * 1000 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  })
);
app.use(
  session({
    name: "adminSession",
    secret: process.env.SESSION_KEY_ADMIN,
    maxAge: 2 * 1000 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  })
);

app.use(shopRoutes);
app.use(adminRoutes);
app.use(cartRoutes);
app.use(supportRoutes);
app.use(checkoutRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page is not found </h1>");
});

const server = http.createServer(app);
server.listen(PORT);
