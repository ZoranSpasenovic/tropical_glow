const fs = require("fs");
const path = require("path");
const p = require("../helpers/path");
const source = path.join(p, "data", "products.json");

const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  package: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  effects: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  skin: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  use: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  natural: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ctg: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  sale_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  sale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Product;

// module.exports = class Product2 {
//   static async fetchAll() {
//     try {
//       const fileContent = await fs.promises.readFile(source);
//       const products = JSON.parse(fileContent);
//       for (const product of products) {
//         await Product.create({
//           name: product.name,
//           package: product.package,
//           unit: product.unit,
//           price: product.price,
//           amount: product.amount,
//           effects: product.effects,
//           skin: product.skin,
//           use: product.use,
//           natural: product.natural,
//           ingredients: product.ingredients,
//           image: product.image,
//           ctg: product.ctg,
//           sale_price: product.sale_price,
//           sale: product.sale,
//         });
//       }
//       return products;
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   static async fetchSearch(query) {
//     const keywords = query.split(" ");
//     try {
//       const fileContent = await fs.promises.readFile(source);
//       const products = JSON.parse(fileContent);
//       const filteredProducts = products.filter((prod) => {
//         return keywords.some((keyword) => {
//           return prod.name.toLowerCase().includes(keyword.toLowerCase());
//         });
//       });
//       return filteredProducts;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async fetchProducts(ctg) {
//     try {
//       const fileContent = await fs.promises.readFile(source);
//       const products = JSON.parse(fileContent);
//       const filteredProducts = products.filter((prod) =>
//         prod.ctg.includes(ctg)
//       );
//       return filteredProducts;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static fetchProductDetails(id, callback) {
//     fs.readFile(source, (err, fileContent) => {
//       let product = {};
//       if (!err) {
//         const products = JSON.parse(fileContent);

//         product = products.find((prod) => prod.id === +id);
//       }
//       callback(product);
//     });
//   }

//   static async fetchSkinConcern(ctg) {
//     try {
//       const fileContent = await fs.promises.readFile(source);
//       const products = JSON.parse(fileContent);
//       const filteredProducts = products.filter((prod) =>
//         prod.ctg.includes(ctg)
//       );
//       return filteredProducts;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async updateProduct(id, body) {
//     try {
//       const fileContent = await fs.promises.readFile(source);
//       const products = JSON.parse(fileContent);
//       const existingProductIndex = products.findIndex((prod) => {
//         return prod.id === id;
//       });
//       const updatedProduct = { ...products[existingProductIndex] };
//       updatedProduct.price = +body.price;

//       updatedProduct.amount = +body.amount;
//       const { sale_check, sale_price } = body;
//       if (sale_check && sale_price > 0) {
//         updatedProduct.sale = true;
//         updatedProduct.sale_price = sale_price;
//       } else {
//         updatedProduct.sale = false;
//         updatedProduct.sale_price = 0;
//       }
//       products[existingProductIndex] = updatedProduct;

//       await fs.promises.writeFile(source, JSON.stringify(products, null, 2));
//       console.log("UPDATED");
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };
