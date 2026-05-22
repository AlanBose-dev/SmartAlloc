const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {

  try {

    const incomeResult = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total_income FROM income"
    );

    const expenseResult = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total_expense FROM expenses"
    );

    const totalIncome = Number(incomeResult.rows[0].total_income);

    const totalExpense = Number(expenseResult.rows[0].total_expense);

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance
    });

  } catch (error) {

    console.log(error);
    res.status(500).send("Server Error");

  }

});

module.exports = router;