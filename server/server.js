const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budget", budgetRoutes);
app.get("/", (req, res) => {
  res.send("SmartAlloc Backend Running");
});
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.send("Database connection failed");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});