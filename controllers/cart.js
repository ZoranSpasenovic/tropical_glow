const getCartProducts = require("../helpers/cartProducts");

const addToCart = (req, res, next) => {
  const { id, qty } = req.body;

  if (!id || qty < 1) {
    res.status(400).json({ error: "Request is not valid!" });
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  let updatedProducts = req.session.cart;
  const existingProductIndex = updatedProducts.findIndex(
    (prod) => prod.id === id
  );
  if (existingProductIndex > -1) {
    const updatedProduct = updatedProducts[existingProductIndex];
    updatedProduct.qty = updatedProduct.qty + qty;
  } else {
    updatedProducts.push({ id, qty });
  }

  req.session.cart = updatedProducts;
  res
    .status(200)
    .json({ message: "Products is added!", cart: updatedProducts });
};

const getCartPage = async (req, res, next) => {
  const { cart, totalPrice } = await getCartProducts(req);

  res.render("cart", {
    pageTitle: "Vaša korpa - Tropical Glow",
    cartCount: cart.length,
    path: "/korpa",
    cart,
    totalPrice,
    cssFiles: ["/css/cart.css"],
    jsFiles: ["/js/cart.js?v=1"],
    metaDescription: false,
    noIndex: true,
  });
};

const updateCart = async (req, res, next) => {
  const { id, qty } = req.body;

  if (!id) {
    res.status(400).json({ error: "Request is not valid!" });
  }

  let updatedProducts = req.session.cart;
  const existingProductIndex = updatedProducts.findIndex(
    (prod) => prod.id === id
  );
  if (existingProductIndex > -1) {
    const updatedProduct = updatedProducts[existingProductIndex];
    if (qty === 0) {
      updatedProducts = updatedProducts.filter(
        (prod) => prod.id !== updatedProduct.id
      );
    } else {
      updatedProduct.qty = qty;
    }
  } else {
    updatedProducts.push({ id, qty });
  }

  req.session.cart = updatedProducts;
  const { cart, totalPrice } = await getCartProducts(req);
  res.status(200).json({ cart, totalPrice });
};

module.exports = { addToCart, getCartPage, updateCart };
