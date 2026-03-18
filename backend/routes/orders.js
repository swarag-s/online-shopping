const router = require("express").Router();
const db = require("../db");

// place a new order
router.post("/", (req, res) => {
  const { customer_id, product_id, quantity } = req.body;
  if (!customer_id || !product_id || !quantity) {
    return res.status(400).json({ error: "customer_id, product_id, and quantity are required" });
  }

  // check stock first
  db.query("SELECT price, stock FROM products WHERE id = ?", [product_id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "product not found" });
    }
    const { price, stock } = result[0];
    if (stock < quantity) {
      return res.status(400).json({ error: "not enough stock" });
    }
    const total_price = price * quantity;
    db.query(
      "INSERT INTO orders (customer_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
      [customer_id, product_id, quantity, total_price],
      (err2) => {
        if (err2) return res.status(500).json({ error: "order failed" });
        res.json({ message: "order placed", total_price });
      }
    );
  });
});

// get order details using join
router.get("/details", (req, res) => {
  db.query(
    `SELECT c.name AS customer, p.name AS product, o.quantity, o.total_price, o.order_date
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     JOIN products p ON o.product_id = p.id
     ORDER BY o.order_date DESC`,
    (err, result) => {
      if (err) return res.status(500).json({ error: "failed to fetch details" });
      res.json(result);
    }
  );
});

// get purchase history using view
router.get("/history", (req, res) => {
  db.query("SELECT * FROM purchase_history ORDER BY order_date DESC", (err, result) => {
    if (err) return res.status(500).json({ error: "failed to fetch history" });
    res.json(result);
  });
});

// get history for a specific customer
router.get("/history/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  db.query(
    `SELECT ph.* FROM purchase_history ph
     JOIN orders o ON ph.order_id = o.id
     WHERE o.customer_id = ?
     ORDER BY ph.order_date DESC`,
    [customer_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "failed to fetch customer history" });
      res.json(result);
    }
  );
});

module.exports = router;
