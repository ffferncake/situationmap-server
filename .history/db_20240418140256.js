// db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("doi_geo", "geo_service", "M@h0lan!Geo", {
  host: "10.10.10.112",
  dialect: "postgres",
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { sequelize, connectDB };
