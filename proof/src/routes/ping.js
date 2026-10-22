const { Router } = require("express");
const { execFile } = require("child_process");

const router = Router();

// Hostnames (RFC 1123 labels) and IPv4/IPv6 literals only. Anything else -- shell
// metacharacters, whitespace, or a leading "-" that ping would read as a flag -- is rejected.
const HOSTNAME_RE = /^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.?$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,45}$/;

function isAllowedHost(host) {
  if (typeof host !== "string" || host.length === 0) return false;
  return HOSTNAME_RE.test(host) || IPV6_RE.test(host);
}

// A network check for the status page: pings the host it is given.
router.get("/ping", (req, res) => {
  const host = req.query.host;
  if (!isAllowedHost(host)) {
    return res.status(400).json({ error: "invalid host" });
  }
  execFile("ping", ["-c", "1", "--", host], (err, stdout) => {
    if (err) return res.status(500).json({ error: "ping failed" });
    res.type("text/plain").send(stdout);
  });
});

module.exports = router;
