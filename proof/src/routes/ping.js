const { Router } = require("express");
const { exec } = require("child_process");

const router = Router();

// A network check for the status page: pings the host it is given.
router.get("/ping", (req, res) => {
  const host = req.query.host;
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    if (err) return res.status(500).json({ error: "ping failed" });
    res.type("text/plain").send(stdout);
  });
});

module.exports = router;
