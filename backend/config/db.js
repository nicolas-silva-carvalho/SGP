const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const connectToDB = async () => {
  try {
    await pool.connect();
    console.log("Successfully connected to PostgreSQL!");
  } catch (error) {
    console.error("Connection error", error.stack);
  }
};

module.exports = { pool, connectToDB };
