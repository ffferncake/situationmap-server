const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db");

const app = express();
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/geo_basemap_get", async (req, res) => {
//   const [results, metadata] = await sequelize.query(
//     "select * from geo_basemap"
//   );
//   res.json(results);
// });

app.get("/geo_map_get", async (req, res) => {
  const [results, metadata] = await sequelize.query("select * from geo_map");
  res.json(results);
});

app.get("/geo_vector_get", async (req, res) => {
  const [results, metadata] = await sequelize.query("select * from geo_vector");
  res.json(results);
});

app.get("/geo_map_vector_get", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    "select * from geo_map_vector"
  );
  res.json(results);
});

app.get("/geo_basemap_get", async (req, res) => {
  try {
    const basemap_id = req.query.basemap_id;
    if (!basemap_id) {
      return res.status(400).json({ error: "Basemap ID is required" });
    }

    const [results, metadata] = await sequelize.query(
      `SELECT * FROM geo_basemap WHERE basemap_id = ${basemap_id}`
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
