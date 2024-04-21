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

app.post("/geo_basemap", async (req, res) => {
  const {
    basemap_id,
    title_th,
    title_en,
    uri,
    tiles,
    glyphs,
    is_public,
    update_by,
    update_at,
    delete_by,
    delete_at,
    create_by,
    create_at,
    is_active,
  } = req.body;

  try {
    // Check if the basemap_id already exists in the database
    const existingBasemap = await sequelize.query(
      "SELECT * FROM geo_basemap WHERE basemap_id = $1",
      {
        bind: [basemap_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingBasemap.length > 0) {
      // Update the existing record
      await sequelize.query(
        "UPDATE geo_basemap SET title_th = $2, title_en = $3, uri = $4, tiles = $5, glyphs = $6, is_public = $7, update_by = $8, update_at = $9, delete_by = $10, delete_at = $11, create_by = $12, create_at = $13, is_active = $14 WHERE basemap_id = $1",
        {
          bind: [
            basemap_id,
            title_th,
            title_en,
            uri,
            tiles,
            glyphs,
            is_public,
            update_by,
            update_at,
            delete_by,
            delete_at,
            create_by,
            create_at,
            is_active,
          ],
        }
      );

      res.status(200).json({ message: "Updated successfully" });
    } else {
      // Insert a new record
      await sequelize.query(
        "INSERT INTO geo_basemap (basemap_id,title_th,title_en,uri,tiles,glyphs,is_public,update_by,update_at,delete_by,delete_at,create_by,create_at,is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        {
          bind: [
            basemap_id,
            title_th,
            title_en,
            uri,
            tiles,
            glyphs,
            is_public,
            update_by,
            update_at,
            delete_by,
            delete_at,
            create_by,
            create_at,
            is_active,
          ],
        }
      );
      res.status(201).json({ message: "Saved successfully" });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/geo_map", async (req, res) => {
  const {
    map_id,
    name,
    description,
    basemap_id,
    center,
    zoom_level,
    pitch,
    bearing,
    is_lock,
    thumbnail_id,
    is_public,
    update_by,
    update_at,
    delete_by,
    delete_at,
    create_by,
    create_at,
    is_active,
  } = req.body;

  try {
    // Check if the basemap_id exists in the geo_basemap table
    const existingBasemap = await sequelize.query(
      "SELECT * FROM geo_basemap WHERE basemap_id = $1",
      {
        bind: [basemap_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingBasemap.length === 0) {
      res.status(400).json({ message: "Basemap does not exist" });
      return;
    }

    // Basemap exists, so insert the map record
    await sequelize.query(
      "INSERT INTO geo_map (map_id,name,description,basemap_id,center,zoom_level,pitch,bearing,is_lock,thumbnail_id,is_public,update_by,update_at,delete_by,delete_at,create_by,create_at,is_active) VALUES ($1, $2, $3, $4, POINT($5, $6), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)",
      {
        bind: [
          map_id,
          name,
          description,
          basemap_id,
          parseFloat(center.split(" ")[0]), // longitude
          parseFloat(center.split(" ")[1]), // latitude
          zoom_level,
          pitch,
          bearing,
          is_lock,
          thumbnail_id,
          is_public,
          update_by,
          update_at,
          delete_by,
          delete_at,
          create_by,
          create_at,
          is_active,
        ],
      }
    );

    res.status(201).json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/geo_map_basemap", async (req, res) => {
  const {
    map_basemap_id,
    map_id,
    update_by,
    update_at,
    delete_by,
    delete_at,
    create_by,
    create_at,
    is_active,
    basemap_id,
  } = req.body;
  try {
    await sequelize.query(
      "INSERT INTO geo_map_basemap (map_basemap_id,map_id,update_by,update_at,delete_by,delete_at,create_by,create_at,is_active,basemap_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      {
        bind: [
          map_basemap_id,
          map_id,
          update_by,
          update_at,
          delete_by,
          delete_at,
          create_by,
          create_at,
          is_active,
          basemap_id,
        ],
      }
    );
    res.status(201).json({ message: "saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/geo_map_vector", async (req, res) => {
  const {
    map_vector_id,
    map_id,
    vector_id,
    update_by,
    update_at,
    delete_by,
    delete_at,
    create_by,
    create_at,
    is_active,
    layer_name,
    style,
  } = req.body;
  try {
    // Check if the map_id exists in the geo_map table
    const existingMap = await sequelize.query(
      "SELECT * FROM geo_map WHERE map_id = $1",
      {
        bind: [map_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingMap.length === 0) {
      return res.status(400).json({ message: "Map ID does not exist" });
    }

    await sequelize.query(
      "INSERT INTO geo_map_vector (map_vector_id,map_id,vector_id,update_by,update_at,delete_by,delete_at,create_by,create_at,is_active,layer_name,style) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      {
        bind: [
          map_vector_id,
          map_id,
          vector_id,
          update_by,
          update_at,
          delete_by,
          delete_at,
          create_by,
          create_at,
          is_active,
          layer_name,
          style,
        ],
      }
    );
    res.status(201).json({ message: "saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/geo_vector", async (req, res) => {
  const {
    vector_id,
    description,
    geom,
    style,
    file_id,
    popup_id,
    is_public,
    update_by,
    update_at,
    delete_by,
    delete_at,
    create_at,
    is_active,
    layer_id,
    layer_name,
    source_id,
  } = req.body;
  try {
    await sequelize.query(
      "INSERT INTO geo_vector (vector_id, description,geom,style,file_id,popup_id,is_public,update_by,update_at,delete_by,delete_at,create_at,is_active,layer_id,layer_name,source_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
      {
        bind: [
          vector_id,
          description,
          geom,
          style,
          file_id,
          popup_id,
          is_public,
          update_by,
          update_at,
          delete_by,
          delete_at,
          create_at,
          is_active,
          layer_id,
          layer_name,
          source_id,
        ],
      }
    );
    res.status(201).json({ message: "saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
