const express = require("express");
const router = express.Router();
const pool = require("../db");

// Save Budget
router.post("/", async (req, res) => {
  try {
    const { monthly_budget, savings_goal, month, year } = req.body;

    const existing = await pool.query(
      "SELECT * FROM budgets WHERE month=$1 AND year=$2",
      [month, year]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE budgets 
         SET monthly_budget=$1, savings_goal=$2
         WHERE month=$3 AND year=$4
         RETURNING *`,
        [monthly_budget, savings_goal, month, year]
      );

      return res.json(updated.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO budgets 
      (monthly_budget, savings_goal, month, year)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [monthly_budget, savings_goal, month, year]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get Budget
router.get("/:month/:year", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM budget"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;