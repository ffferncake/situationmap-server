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

    const query = {
      text: "SELECT * FROM geo_basemap WHERE basemap_id = $1::uuid",
      values: [basemap_id],
    };

    const [results, metadata] = await sequelize.query(query.text, {
      bind: query.values,
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Basemap not found" });
    }

    res.json(results[0]); // Assuming you want to return the first result
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
