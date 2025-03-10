const Sequelize = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Veza sa bazom je uspešna!");
  })
  .catch((err) => {
    console.error("Nemoguće se povezati sa bazom:", err);
  });

module.exports = sequelize;
