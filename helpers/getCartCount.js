const getCartCount = (req) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  return cartCount;
};

module.exports = getCartCount;
