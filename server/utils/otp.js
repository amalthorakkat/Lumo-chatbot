const crypto = require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const setOTPExpiry = () => {
  const now = new Date();
  now.setMinutes(
    now.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || 10)
  );
  return now;
};

module.exports = { generateOTP, setOTPExpiry };
