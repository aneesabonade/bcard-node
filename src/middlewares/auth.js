const jwt = require("jsonwebtoken");
const config = require("../config/config");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // must include: _id, isBusiness, isAdmin :contentReference[oaicite:5]{index=5}
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin only" });
  next();
}

function requireBusiness(req, res, next) {
  if (!req.user?.isBusiness) return res.status(403).json({ message: "Business only" });
  next();
}

module.exports = { auth, requireAdmin, requireBusiness };