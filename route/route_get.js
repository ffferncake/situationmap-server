const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../db");
const { QueryTypes } = require("sequelize");

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
  const body = req.body
  // console.log(body)
  const userId = body.request_by.id
  const sql = `
  select * from geo_map 
  where 
  (create_by = '${userId}'
  or 
  geo_map.is_public)
  and
  geo_map.is_active
  `
  const [results, metadata] = await sequelize.query(sql);
  res.json(results);
});

app.get("/geo_vector_get", async (req, res) => {
  const [results, metadata] = await sequelize.query("select * from geo_vector");
  res.json(results);
});

// app.get("/geo_map_vector_get", async (req, res) => {
//   const [results, metadata] = await sequelize.query("select * from geo_map_vector");
//   res.json(results);
// });

// http://localhost:1348/geo_map_vector_get/?map_id=c27f255a-5277-4eb5-9874-2c0fd00ec3f7
// app.get("/geo_map_vector_get", async (req, res) => {
//   const mapId = req.query.map_id;

//   if (!mapId) {
//     return res.status(400).json({ error: "map_id parameter is required" });
//   }

//   const [results, metadata] = await sequelize.query(
//     "SELECT * FROM geo_map_vector WHERE map_id = :mapId",
//     {
//       replacements: { mapId },
//       type: sequelize.QueryTypes.SELECT,
//     }
//   );

//   res.json(results);
// });

app.get("/geo_map_vector_get", async (req, res) => {
  const mapId = req.query.map_id;

  if (!mapId) {
    return res.status(400).json({ error: "map_id parameter is required" });
  }

  const query = `
    SELECT *
    FROM geo_map_vector
    JOIN geo_vector ON geo_map_vector.vector_id = geo_vector.vector_id
    WHERE geo_map_vector.map_id = :mapId
  `;

  const [results, metadata] = await sequelize.query(query, {
    replacements: { mapId },
    type: sequelize.QueryTypes.SELECT
  });

  res.json(results);
});

app.get("/geo_basemap_get", async (req, res) => {
  try {
    const basemap_id = req.query.basemap_id;
    if (!basemap_id) {
      return res.status(400).json({ error: "Basemap ID is required" });
    }

    const query = `
      SELECT * 
      FROM geo_basemap 
      WHERE basemap_id = :basemap_id::uuid
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { basemap_id }
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
