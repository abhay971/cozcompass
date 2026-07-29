const crypto = require("crypto");

// Short-lived token for the ops dashboard share links.
function shareToken(orderId) {
  return crypto.createHash("sha256").update(String(orderId)).digest("hex");
}

module.exports = { shareToken };
