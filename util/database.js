const Sequelize = require("sequelize");

const sequelize = new Sequelize("tropical_glow", "root", "thuglife7", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;