const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(
    "Auth Middleware - Received Token:",
    token || "No token provided"
  );
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware - Decoded Token:", decoded);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("Auth Middleware - User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      console.error("Auth Middleware - User not verified:", decoded.userId);
      return res.status(401).json({ message: "User not verified" });
    }
    req.user = { userId: user._id.toString() };
    console.log("Auth Middleware - User authenticated:", req.user.userId);
    next();
  } catch (error) {
    console.error("Auth Middleware - Token Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;
