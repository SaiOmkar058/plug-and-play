const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// =============================
// ALL SENSOR IMAGE URLS
// =============================
const SENSOR_IMAGES = {
  1: "https://res.cloudinary.com/dxrfpaqpr/image/upload/v1771923074/lqnkmtggp9tb5a0qslwr.jpg",
  2: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
  3: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
  4: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
  5: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
  6: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
  7: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  8: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  9: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
  10: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  11: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  12: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  13: "https://thinkrobotics.com/cdn/shop/products/BNO055-Module2_535x.png?v=1673605453",
  14: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  15: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  16: "https://cdn-shop.adafruit.com/970x728/904-09.jpg",
  17: "https://cdn-shop.adafruit.com/970x728/904-09.jpg",
  18: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  19: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  20: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  21: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  22: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
  23: "https://cdn-shop.adafruit.com/970x728/1713-03.jpg",
  24: "https://cdn-shop.adafruit.com/970x728/1713-03.jpg",
  25: "https://m.media-amazon.com/images/I/419rBd9kn2L._AC_UF1000,1000_QL80_.jpg",
  26: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
  27: "https://cdn-shop.adafruit.com/970x728/3421-03.jpg",
  28: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
  29: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
  30: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
  31: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
  32: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
  33: "https://robu.in/wp-content/uploads/2017/04/sct-013-030-30a-non-invasive-ac-current-clamp-sensor.jpg",
  34: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
  35: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
  36: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
  37: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
  38: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
  39: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
  40: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
};

// Connect to SQLite database
const db = new sqlite3.Database("./sensors.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to SQLite database.");

  // Step 1: Migration — add image_url if it doesn't exist
  db.run("ALTER TABLE sensors ADD COLUMN image_url TEXT", (err) => {
    if (err && !err.message.includes("duplicate column name")) {
      console.error("Migration Error:", err.message);
    } else {
      console.log("Migration: image_url column OK.");
    }

    // Step 2: Auto-seed images on every server start (handles ephemeral DB on Render)
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      for (const [id, url] of Object.entries(SENSOR_IMAGES)) {
        db.run("UPDATE sensors SET image_url = ? WHERE sensor_id = ?", [url, parseInt(id)]);
      }
      db.run("COMMIT", (err) => {
        if (err) console.error("Auto-seed Error:", err.message);
        else console.log("Auto-seed: All sensor image URLs applied.");
      });
    });
  });
});

// =============================
// GET ALL SENSORS
// =============================
app.get("/sensors", (req, res) => {
  const query = `
    SELECT sensor_id, sensor_name, manufacturer, category_name, image_url
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
    SELECT s.sensor_id, s.sensor_name, s.manufacturer, c.category_name, s.image_url
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
  const { name, manufacturer, category_id, image_url } = req.body;

  db.run(
    `INSERT INTO sensors (sensor_name, manufacturer, category_id, output_type, industrial_grade, application, image_url)
     VALUES (?, ?, ?, 'Manual', 'Yes', 'Added from Admin', ?)`,
    [name, manufacturer, category_id, image_url],
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
    SELECT s.sensor_name, s.manufacturer, c.category_name, s.image_url,
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


// =============================
// PROD SEEDER — all 40 sensors
// =============================
app.get("/seed-prod", (req, res) => {
  const SENSOR_IMAGES = {
    1: "https://res.cloudinary.com/dxrfpaqpr/image/upload/v1771923074/lqnkmtggp9tb5a0qslwr.jpg",
    2: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    3: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
    4: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    5: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
    6: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
    7: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    8: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    9: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    10: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    11: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    12: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    13: "https://thinkrobotics.com/cdn/shop/products/BNO055-Module2_535x.png?v=1673605453",
    14: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    15: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    16: "https://cdn-shop.adafruit.com/970x728/904-09.jpg",
    17: "https://cdn-shop.adafruit.com/970x728/904-09.jpg",
    18: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    19: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    20: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    21: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    22: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/4/14544-SparkFun_Current_Sensor_Breakout_-_ACS723__Low_Current_-01.jpg",
    23: "https://cdn-shop.adafruit.com/970x728/1713-03.jpg",
    24: "https://cdn-shop.adafruit.com/970x728/1713-03.jpg",
    25: "https://m.media-amazon.com/images/I/419rBd9kn2L._AC_UF1000,1000_QL80_.jpg",
    26: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
    27: "https://cdn-shop.adafruit.com/970x728/3421-03.jpg",
    28: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
    29: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
    30: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
    31: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
    32: "https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/8/18011-SparkFun_Analog_MEMS_Microphone_Breakout_-_ICS-40180-01.jpg",
    33: "https://robu.in/wp-content/uploads/2017/04/sct-013-030-30a-non-invasive-ac-current-clamp-sensor.jpg",
    34: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
    35: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    36: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    37: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    38: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    39: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    40: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
  };

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    for (const [id, url] of Object.entries(SENSOR_IMAGES)) {
      db.run("UPDATE sensors SET image_url = ? WHERE sensor_id = ?", [url, parseInt(id)]);
    }
    db.run("COMMIT", (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "All 40 sensor images seeded", total: Object.keys(SENSOR_IMAGES).length });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});