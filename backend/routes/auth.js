const router = require("express").Router();
const db = require("../db");

// register a new customer
router.post("/register", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  db.query(
    "INSERT INTO customers (name, email) VALUES (?, ?)",
    [name, email],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "email already registered" });
        }
        return res.status(500).json({ error: "registration failed" });
      }
      res.json({ message: "registered successfully" });
    }
  );
});

// login an existing customer
router.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  db.query(
    "SELECT * FROM customers WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ error: "login failed" });
      if (result.length === 0) {
        return res.status(404).json({ error: "customer not found" });
      }
      res.json(result[0]);
    }
  );
});

module.exports = router;
