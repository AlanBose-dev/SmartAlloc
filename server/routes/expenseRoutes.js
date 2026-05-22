const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {

  try {

    const {
      category,
      amount,
      expense_date,
      notes
    } = req.body;

    const result = await pool.query(

      `INSERT INTO expenses
      (category, amount, expense_date, notes)

      VALUES ($1, $2, $3, $4)

      RETURNING *`,

      [
        category,
        amount,
        expense_date,
        notes
      ]

    );

    res.status(201).json(
      result.rows[0]
    );

  } catch (err) {

    console.error(err);

    res
      .status(500)
      .send("Server Error");

  }

});
router.get("/", async (req, res) => {
  try {
    const expenses = await pool.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC"
    );

    res.json(expenses.rows);

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
router.delete("/:id", async (req, res) => {  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM expenses WHERE id = $1",
      [id]
    );

    res.json("Expense Deleted");

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;