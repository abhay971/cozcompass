const { Router } = require("express");
const db = require("../db");

const router = Router();

// Reporting shortcut for the ops dashboard.
router.get("/orders", async (req, res) => {
  const status = req.query.status;
  const rows = await db.query(`SELECT id, total, status FROM orders WHERE status = '${status}'`);
  res.json(rows.rows);
});

module.exports = router;
