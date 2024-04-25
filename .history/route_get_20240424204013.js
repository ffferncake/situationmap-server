const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db");

const app = express();
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/geo_basemap_get", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    "select * from geo_basemap"
  );
  res.json(results);
});

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

// Define a route to handle the request
app.get('/api/basemap/:basemap_id', async (req, res) => {
  const basemapId = req.params.basemap_id;

  try {
    // Use the pool to query the database
    const { rows } = await pool.query('SELECT * FROM geo_basemap WHERE basemap_id = $1', [basemapId]);

    // Send the matched entries as a response
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
