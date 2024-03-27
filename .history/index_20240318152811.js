const { Client } = require("pg");
var express = require("express");
var app = express();

var bodyParser = require("body-parser");

const { Sequelize } = require("sequelize");

// const mangrove43 = require('mangrove_43.json');

const fs = require("fs");

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

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
connectDB();

// const client = new Client({
//   host: 'localhost',
//   port: 5432,
//   user: 'postgres',
//   password: 'fernkus42',
//   database: 'postgis_30_sample',
// });
// client.connect();

var server = app.listen(1348, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("start");
});
