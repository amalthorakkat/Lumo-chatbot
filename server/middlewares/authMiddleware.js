const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(
    "Auth Middleware - Received Token:",
    token || "No token provided"
  ); // Debug log
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware - Decoded Token:", decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware - Token Verification Error:", error.message); // Debug log
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;
