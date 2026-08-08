const jwt = require("jsonwebtoken");

// Verify user is logged in
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Verify user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.userType === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, isAdmin };