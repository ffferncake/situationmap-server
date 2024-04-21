const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const routes = require("./routes");

connectDB().then(() => {
  const app = express();

  // Enable CORS for all requests
  app.use(cors());

  // Use your existing routes
  app.use("/", routes);

  const server = app.listen(1348, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is running on port", port);
  });
});
