const { Router } = require("express");
const db = require("../db");

const router = Router();

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`SELECT id, name, email FROM users WHERE id = ${id}`);
  res.json(result.rows[0] ?? null);
});

module.exports = router;
