const router = require("express").Router();
const db = require("../db");

// get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json({ error: "failed to fetch products" });
    res.json(result);
  });
});

module.exports = router;
