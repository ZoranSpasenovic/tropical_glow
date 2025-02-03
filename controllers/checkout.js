const Joi = require("joi");
const getCartProducts = require("../helpers/cartProducts");
const Product = require("../models/product");
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
const { name } = require("ejs");

const validateOrder = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Molimo vas unesite email adresu.",
    "string.email": "Molimo vas unesite pravilnu email adresu.",
  }),

  firstName: Joi.string().min(2).required().messages({
    "string.empty": "Molimo vas unesite ime.",
    "string.min": "Molimo vas unesite pravilno ime.",
  }),

  lastName: Joi.string().min(2).required().messages({
    "string.empty": "Molimo vas unesite prezime.",
    "string.min": "Molimo vas unesite pravilno prezime.",
  }),

  address: Joi.string().min(5).required().messages({
    "string.empty": "Molimo vas unesite adresu.",
    "string.min": "Molimo vas unesite pravilnu adresu.",
  }),

  phone: Joi.string().min(9).required().messages({
    "string.empty": "Molimo vas unesite broj telefona.",
    "string.min": "Molimo vas unesite ispravan broj telefona.",
  }),

  postalCode: Joi.string().min(5).required().messages({
    "string.empty": "Molimo vas unesite poštanski broj.",
    "string.min": "Molimo vas unesite ispravan poštanski broj.",
  }),

  city: Joi.string().min(2).required().messages({
    "string.empty": "Molimo vas unesite grad.",
    "string.min": "Molimo vas unesite ispravan naziv grada.",
  }),

  deliveryNote: Joi.string().allow("").optional(),
});

const getCheckoutPage = async (req, res, next) => {
  const { cart, totalPrice } = await getCartProducts(req);
  res.render("checkout", {
    pageTitle: "Tropical Glow - Napravi Porudzbinu",
    cartCount: cart.length,
    path: "/checkout",
    cart,
    totalPrice,
    cssFiles: ["/css/checkout.css"],
    jsFiles: [],
    errors: [],
    formData: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      postalCode: "",
      city: "",
      deliveryNote: "",
    },
  });
};

const createOrder = async (req, res, next) => {
  try {
    await validateOrder.validateAsync(req.body);
  } catch (error) {
    const { cart, totalPrice } = await getCartProducts(req);
    return res.render("checkout", {
      pageTitle: "Tropical Glow - Napravi Porudzbinu",
      cartCount: cart.length,
      path: "/checkout",
      cart,
      totalPrice,
      cssFiles: ["/css/checkout.css"],
      jsFiles: [],
      errors: error.details.map((err) => err.message),
      formData: req.body,
    });
  }
  try {
    const { cart, totalPrice } = await getCartProducts(req);
    const errors = [];

    for (const item of cart) {
      const product = await Product.findByPk(item.id);
      if (!product || product.amount < item.qty) {
        errors.push(
          `Proizvoda "${item.name}" nema dovoljno na stanju. Trenutna dostupna kolicina je :${product.amount}, hvala na razumevanju`
        );
        return res.render("checkout", {
          pageTitle: "Tropical Glow - Napravi Porudzbinu",
          cartCount: cart.length,
          path: "/checkout",
          cart,
          totalPrice,
          cssFiles: ["/css/checkout.css"],
          jsFiles: [],
          errors,
          formData: req.body,
        });
      }
    }

    const orderRows = cart
      .map((item) => {
        return `      <tr>
        <td
          style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 20px"
        >
          <strong>${item.name}</strong>
          <p style="margin: 5px 0; font-size: 16px">Cena: RSD${item.price}</p>
        </td>
        <td
          style="
            text-align: right;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 20px;
          "
        >
          ${item.qty}
        </td>
        <td
          style="
            text-align: right;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 16px;
          "
        >
          RSD${item.total}
        </td>
      </tr>`;
      })
      .join("");
    const {
      email,
      firstName,
      lastName,
      address,
      phone,
      postalCode,
      city,
      deliveryNote,
    } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY,
      },
    });
    const orderId = "" + Math.floor(Math.random() * 1000000);
    const mailToUser = {
      from: "spalespasenovic@gmail.com",
      to: email,
      subject: `Uspesno kreiranje porudzbine br. ${orderId}`,
      text: `Uspesno ste kreirali porudzbinu br. ${orderId} , podaci o vasoj porudzbini su : 
      ukupna cena: ${totalPrice},
      proizvodi : ${JSON.stringify(cart)}`,
      html: `<html>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0 auto;
      padding: 2rem;
      font-size: 20px;
    "
  >
    <h2 style="text-align: center">Informacije o porudzbini br. ${orderId}</h2>

    <table style="width: 100%; border-collapse: collapse">
      <tr>
        <td style="width: 50%; padding: 10px; vertical-align: top">
          <h3 style="margin: 0">Informacije o kupcu</h3>
          <p style="margin: 5px 0"><strong>${firstName} ${lastName}</strong></p>
          <p style="margin: 5px 0">${phone}</p>
          <p style="margin: 5px 0">
            <a
              href="mailto:${email}"
              style="color: #0073aa; text-decoration: none"
              >${email}</a
            >
          </p>
        </td>

        <td style="width: 50%; padding: 10px; vertical-align: top">
          <h3 style="margin: 0">Informacije o dostavi</h3>
      
          <p style="margin: 5px 0">${city}</p>
          <p style="margin: 5px 0">
            <a
              href="https://maps.google.com/?q=${city}+${address}"
              style="color: #0073aa; text-decoration: none"
              >${address}</a
            >
          </p>
          <p style="margin: 5px 0">${postalCode}</p>
        </td>
      </tr>
    </table>

    <p style="margin: 10px 0"><strong>Nacin isporuke:</strong>Standard</p>

    <h3 style="border-bottom: 2px solid #ddd; padding-bottom: 5px">
      Informacije o porudzbini
    </h3>
    <p>Br. porudzbine: ${orderId}</p>
    <table style="width: 100%; border-collapse: collapse">
      <tr>
        <th
          style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd"
        >
          Proizvod
        </th>
        <th
          style="
            text-align: right;
            padding: 10px;
            border-bottom: 2px solid #ddd;
          "
        >
          Kolicina
        </th>
        <th
          style="
            text-align: right;
            padding: 10px;
            border-bottom: 2px solid #ddd;
          "
        >
          Ukupno
        </th>
      </tr>
     ${orderRows}
    </table>

    <!-- Order Summary -->
    <table
      style="
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 20px;
      "
    >
      <tr>
        <td style="text-align: left; padding: 10px">Medjuzbir</td>
        <td style="text-align: right; padding: 10px">RSD${totalPrice}</td>
      </tr>
      <tr>
        <td style="text-align: left; padding: 10px">Dostava</td>
        <td style="text-align: right; padding: 10px">RSD450.00</td>
      </tr>
      <tr>
        <td style="text-align: left; padding: 10px; font-weight: bold">
          Ukupno za placanje
        </td>
        <td style="text-align: right; padding: 10px; font-weight: bold">
         RSD${totalPrice}
        </td>
      </tr>
    </table>

    <div style="margin-top: 30px; text-align: center">
      <p>
        ukoliko imate dodatnih pitanja vezano za isporuku mozete nam se obratiti
        na email :
        <a href="mailto:tropicalglow.rs@gmail.com">tropicalglow.rs@gmail.com</a>
      </p>
    </div>
  </body>
</html>
`,
    };
    await transporter.sendMail(mailToUser);

    for (const item of cart) {
      await Product.update(
        {
          amount: Sequelize.literal(`amount - ${item.qty}`),
        },
        { where: { id: item.id } }
      );
    }

    req.session.cart = null;
  } catch (err) {
    console.log(err);
  }

  res.redirect("/checkout");
};

const testingEmail = (req, res, next) => {
  res.render("test");
};

module.exports = { getCheckoutPage, createOrder, testingEmail };
