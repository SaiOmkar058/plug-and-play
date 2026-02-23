const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./sensors.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to SQLite database.");
});

// =============================
// GET ALL SENSORS
// =============================
app.get("/sensors", (req, res) => {
  const query = `
    SELECT sensor_id, sensor_name, manufacturer, category_name
    FROM sensors
    JOIN sensor_category USING(category_id)
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// =============================
// GET BY CATEGORY
// =============================
app.get("/category/:name", (req, res) => {
  const category = req.params.name;

  const query = `
    SELECT s.sensor_id, s.sensor_name, s.manufacturer, c.category_name
    FROM sensors s
    JOIN sensor_category c on s.category_id = c.category_id
    WHERE LOWER(c.category_name) = LOWER(?)
  `;

  db.all(query, [category], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// =============================
// ADD SENSOR (simple version)
// =============================
app.post("/add", (req, res) => {
  const { name, manufacturer, category_id } = req.body;

  db.run(
    `INSERT INTO sensors (sensor_name, manufacturer, category_id, output_type, industrial_grade, application)
     VALUES (?, ?, ?, 'Manual', 'Yes', 'Added from Admin')`,
    [name, manufacturer, category_id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Sensor Added", id: this.lastID });
    }
  );
});

// =============================
// GET FULL SENSOR DETAILS
// =============================
app.get("/sensor/:id", (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT s.sensor_name, s.manufacturer, c.category_name,
           e.operating_voltage, e.power_consumption, e.interface_type,
           m.measurement_range, m.accuracy, m.sensitivity, m.response_time,
           env.operating_temperature, env.durability, env.mounting_type
    FROM sensors s
    JOIN sensor_category c ON s.category_id = c.category_id
    LEFT JOIN electrical_specs e ON s.sensor_id = e.sensor_id
    LEFT JOIN measurement_specs m ON s.sensor_id = m.sensor_id
    LEFT JOIN environmental_specs env ON s.sensor_id = env.sensor_id
    WHERE s.sensor_id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});