/**
 * seed-images-retry.js — Retry for failed sensors with verified Adafruit/SparkFun/Amazon URLs
 */

const https = require("https");
const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const CLOUD_NAME = "dxrfpaqpr";
const UPLOAD_PRESET = "qi0bg3ee";
const DB_PATH = path.join(__dirname, "sensors.db");

// Verified working URLs for the sensors that failed previously
const SENSOR_IMAGES = {
    // Current sensors (ACS712 family) — SparkFun CDN
    14: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    15: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    16: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    17: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    // INA219 / INA3221 — Adafruit CDN
    18: "https://cdn-shop.adafruit.com/970x728/904-00.jpg",
    19: "https://cdn-shop.adafruit.com/970x728/904-00.jpg",
    // WCS1800, LAH, HAL — ACS712 style
    20: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    21: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    22: "https://cdn.sparkfun.com/assets/parts/2/4/4/6/08883-01.jpg",
    // Sound sensors — Adafruit / SparkFun CDN
    23: "https://cdn-shop.adafruit.com/970x728/1713-00.jpg",   // MAX9814
    24: "https://cdn-shop.adafruit.com/970x728/1713-00.jpg",   // MAX4466
    25: "https://m.media-amazon.com/images/I/419rBd9kn2L._AC_UF1000,1000_QL80_.jpg",  // INMP441
    26: "https://cdn-shop.adafruit.com/970x728/3421-00.jpg",   // SPH0645
    27: "https://cdn-shop.adafruit.com/970x728/3421-00.jpg",   // ICS-43434
    28: "https://cdn.sparkfun.com/assets/parts/3/2/5/3/09868-01.jpg",  // ADMP401
    29: "https://cdn.sparkfun.com/assets/parts/3/2/5/3/09868-01.jpg",  // SPU0410LR5H
    32: "https://cdn.sparkfun.com/assets/parts/3/2/5/3/09868-01.jpg",  // ADMP404
    // SCT-013 — Amazon
    33: "https://m.media-amazon.com/images/I/41-T-O0B+dL._AC_UF1000,1000_QL80_.jpg",
};

function downloadImage(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) return reject(new Error("Too many redirects"));
        const mod = url.startsWith("https") ? https : http;
        mod.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
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
        }).on("error", reject);
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
                    else reject(new Error(json.error?.message || "Upload failed"));
                } catch (e) { reject(e); }
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
    const db = new sqlite3.Database(DB_PATH);
    await new Promise((res) => setTimeout(res, 500));
    console.log("✅ Connected to DB\n");

    const dbRun = (sql, params) =>
        new Promise((res, rej) => db.run(sql, params, function (err) { if (err) rej(err); else res(this); }));

    const entries = Object.entries(SENSOR_IMAGES);
    console.log(`🚀 Retrying upload for ${entries.length} previously-failed sensors...\n`);

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
