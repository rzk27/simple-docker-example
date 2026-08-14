const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.json());

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS button_clicks (
            id SERIAL PRIMARY KEY,
            clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    console.log("Database initialized");
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.post("/api/click", async (req, res) => {
    try {
        const result = await pool.query(`
            INSERT INTO button_clicks
            DEFAULT VALUES
            RETURNING *
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/clicks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM button_clicks
            ORDER BY clicked_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

initializeDatabase()
    .then(() => {
        app.listen(8000, "0.0.0.0", () => {
            console.log("Web server running on port 8000");
        });
    })
    .catch(error => {
        console.error("Could not initialize database:", error);
        process.exit(1);
    });