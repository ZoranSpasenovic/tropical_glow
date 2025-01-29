const Product = require("../models/product")

const getCartProducts = async (req) => {
  const products = await Product.findAll();

  const cartProducts = req.session.cart || [];

  let cart = cartProducts.map((prod) => {
    const element = products.find((item) => item.id === prod.id);

    return { ...element.dataValues, qty: prod.qty };
  });

  cart = cart.map((prod) => {
    return {
      id: prod.id,
      name: prod.name,
      price: prod.sale ? prod.sale_price : prod.price,
      image: prod.image,
      package: prod.package + prod.unit,
      qty: prod.qty,
      total: prod.qty * (prod.sale ? prod.sale_price : prod.price),
    };
  });

  const totalPrice = cart.reduce((acc, prod) => acc + prod.total, 0);
  return { cart, totalPrice };
};

module.exports = getCartProducts;
