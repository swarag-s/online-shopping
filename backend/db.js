require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "shop"
});

db.connect((err) => {
  if (err) {
    console.error("database connection failed:", err.message);
    console.error("check your .env file and make sure mysql is running");
    process.exit(1);
  }
  console.log("connected to mysql database:", process.env.DB_NAME || "shop");
});

module.exports = db;
