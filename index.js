const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const { authenCore } = require("./auth");
const { config } = require("dotenv");

const route_post = require("./route/route_post");
const route_get = require("./route/route_get");

config();

connectDB().then(() => {
  const app = express();

  // require authen
  // app.use(authenCore);

  // Enable CORS for all requests
  app.use(cors());

  // Use existing route_post
  app.use("/",(req, res, next)=> authenCore(req, res, next,'create'), route_post);
  // app.use("/", route_post);

  // Use  existing route_get
  app.use("/",(req, res, next)=> authenCore(req, res, next,'view'), route_get);
  // app.use("/", route_get);

  const server = app.listen(1348, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is running on port", port);
  });
});
