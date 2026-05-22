const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {

    const { source, amount, income_date, notes } = req.body;

    const newIncome = await pool.query(
      `INSERT INTO income 
      (source, amount, income_date, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [source, amount, income_date, notes]
    );

    res.json(newIncome.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {  try {

    const incomes = await pool.query(
      "SELECT * FROM income ORDER BY income_date DESC"
    );

    res.json(incomes.rows);

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM income WHERE id = $1",
      [id]
    );

    res.json("Income Deleted");

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;