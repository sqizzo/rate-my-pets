const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // get header authorization
  const authHeader = req.get("authorization");

  // cek apakah token ada, dan formatnya Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token" });
  }

  // ambil bagian token tanpa bearer
  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
