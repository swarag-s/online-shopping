require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
