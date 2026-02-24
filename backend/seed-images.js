/**
 * seed-images.js — Final version with verified working URLs
 * Run with: node seed-images.js
 */

const https = require("https");
const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const CLOUD_NAME = "dxrfpaqpr";
const UPLOAD_PRESET = "qi0bg3ee";
const DB_PATH = path.join(__dirname, "sensors.db");

// Verified working direct image URLs (sensor_id → image URL)
// Images sourced from electronics shops and Amazon — publicly accessible
const SENSOR_IMAGES = {
    // Temperature
    2: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    3: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
    4: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    5: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
    6: "https://m.media-amazon.com/images/I/61p5FJWr6CL.jpg",
    7: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",

    // Vibration / IMU
    8: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    9: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    10: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    11: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    12: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",
    13: "https://thinkrobotics.com/cdn/shop/products/BNO055-Module2_535x.png?v=1673605453",
    37: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    38: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    39: "http://quartzcomponents.com/cdn/shop/products/ADXL345-Accelerometer.jpg?v=1646474129",
    40: "https://quartzcomponents.com/cdn/shop/products/MPU6050-Gyroscope-Sensor_grande.jpg?v=1653298999",

    // Current
    14: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    15: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    16: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    17: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    18: "https://robu.in/wp-content/uploads/2019/12/CJMCU-219-INA219-I2C-Interface-No-Drift-Bi-directional-Current-Power-Monitoring-Sensor-Module-1.jpg",
    19: "https://robu.in/wp-content/uploads/2019/12/CJMCU-219-INA219-I2C-Interface-No-Drift-Bi-directional-Current-Power-Monitoring-Sensor-Module-1.jpg",
    20: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    21: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    22: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",
    33: "https://robu.in/wp-content/uploads/2014/06/current-sensor-module-acs712.jpg",

    // Sound / Microphone
    23: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    24: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    25: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    26: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    27: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    28: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    29: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",
    30: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
    31: "https://m.media-amazon.com/images/I/516NZTU4lGL._AC_UF1000,1000_QL80_.jpg",
    32: "https://www.flyrobo.in/image/cache/catalog/max4466-electret-microphone-amplifier/max4466-electret-microphone-amplifier1-550x550.jpg",

    // Remaining temperature
    34: "https://www.sunrobotics.in/cdn/shop/files/DS18B20-Temperature-Sensor-Module-1-462x461.jpg?v=1746160155",
    35: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
    36: "https://robu.in/wp-content/uploads/2017/06/AM2302-DHT22-Digital-Temperature-and-Humidity-Sensor-Module-1.jpg",
};

// ─── HELPERS ───────────────────────────────────────────────────────────────

function downloadImage(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) return reject(new Error("Too many redirects"));
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "image/*",
                "Referer": "https://www.google.com/",
            },
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadImage(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
            res.on("error", reject);
        });
        req.on("error", reject);
        req.setTimeout(10000, () => { req.destroy(); reject(new Error("Timeout")); });
    });
}

function uploadBuffer(buffer, contentType, filename) {
    return new Promise((resolve, reject) => {
        const boundary = "----Boundary" + Math.random().toString(36).slice(2);
        const ext = contentType.includes("png") ? "png" : "jpg";
        const header = Buffer.from(
            `--${boundary}\r\nContent-Disposition: form-data; name="upload_preset"\r\n\r\n${UPLOAD_PRESET}\r\n` +
            `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}.${ext}"\r\nContent-Type: ${contentType}\r\n\r\n`
        );
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const body = Buffer.concat([header, buffer, footer]);

        const options = {
            hostname: "api.cloudinary.com",
            path: `/v1_1/${CLOUD_NAME}/image/upload`,
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
                "Content-Length": body.length,
            },
        };

        const req = https.request(options, (res) => {
            let raw = "";
            res.on("data", (c) => (raw += c));
            res.on("end", () => {
                try {
                    const json = JSON.parse(raw);
                    if (json.secure_url) resolve(json.secure_url);
                    else reject(new Error(json.error?.message || `Upload failed`));
                } catch (e) { reject(e); }
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
    const db = new sqlite3.Database(DB_PATH);
    await new Promise((res) => db.once("open", res));
    console.log("✅ Connected to DB\n");

    const dbRun = (sql, params) =>
        new Promise((res, rej) => db.run(sql, params, function (err) { if (err) rej(err); else res(this); }));

    const entries = Object.entries(SENSOR_IMAGES);
    console.log(`🚀 Uploading images for ${entries.length} sensors...\n`);

    let success = 0, failed = 0;

    for (const [sensorId, imageUrl] of entries) {
        const id = parseInt(sensorId);
        try {
            process.stdout.write(`[${String(id).padStart(2)}] Downloading... `);
            const { buffer, contentType } = await downloadImage(imageUrl);
            process.stdout.write(`${(buffer.length / 1024).toFixed(0)}KB → Cloudinary... `);
            const cloudUrl = await uploadBuffer(buffer, contentType, `sensor_${id}`);
            await dbRun("UPDATE sensors SET image_url = ? WHERE sensor_id = ?", [cloudUrl, id]);
            console.log(`✅`);
            success++;
        } catch (err) {
            console.log(`❌ ${err.message.slice(0, 60)}`);
            failed++;
        }
        await sleep(500);
    }

    db.close();
    console.log(`\n══════════════════════════════`);
    console.log(`✅ Success: ${success}   ❌ Failed: ${failed}   Total: ${entries.length}`);
    console.log(`Done!`);
}

main().catch(console.error);
