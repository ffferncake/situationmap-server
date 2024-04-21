const app = require("./routes");
const { connectDB } = require("./db");

connectDB().then(() => {
  const server = app.listen(1348, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("start");
  });
});
