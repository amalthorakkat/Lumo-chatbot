const express = require("express");
const router = express.Router();
const {
  signup,
  verifyOTPSignup,
  login,
  verifyOTPLogin,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verify-otp-signup", verifyOTPSignup);
router.post("/login", login);
router.post("/verify-otp-login", verifyOTPLogin);

module.exports = router;
