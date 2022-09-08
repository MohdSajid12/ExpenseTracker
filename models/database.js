const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("newexpense", "root", "Sajid786sajid", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize