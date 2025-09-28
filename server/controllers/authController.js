const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateOTP, setOTPExpiry } = require("../utils/otp");
const { generateOTPEmail } = require("../utils/emailTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.APP_NAME || "Lumo"} OTP Verification`,
    html: generateOTPEmail(otp),
  };
  await transporter.sendMail(mailOptions);
};

const signup = async (req, res) => {
  const { email, password, username, name } = req.body;

  if (
    !email ||
    !password ||
    !username ||
    !name ||
    password.length < 6 ||
    username.length < 3
  ) {
    return res.status(400).json({
      message:
        "All fields required: email, password (min 6), username (min 3), name",
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    user = new User({ email, password, username, name });
    const otp = generateOTP();
    user.verificationToken = otp;
    user.verificationTokenExpiry = setOTPExpiry();
    await user.save();

    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTPSignup = async (req, res) => {
  const { email, otp } = req.body;

  console.log("Verify OTP Signup Request:", { email, otp });

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
      return res
        .status(400)
        .json({ message: "Invalid email or already verified" });
    }

    if (
      user.verificationToken !== otp ||
      user.verificationTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, message: "Account verified and logged in" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username or email and password required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = generateOTP();
    user.verificationToken = otp;
    user.verificationTokenExpiry = setOTPExpiry();
    await user.save();

    await sendOTP(user.email, otp);

    res.json({
      message: "OTP sent to email. Please verify to login.",
      email: user.email,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTPLogin = async (req, res) => {
  const { email, otp } = req.body;

  console.log("Verify OTP Login Request:", { email, otp });

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "Invalid email or unverified account" });
    }

    if (
      user.verificationToken !== otp ||
      user.verificationTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Verify Login OTP Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup, verifyOTPSignup, login, verifyOTPLogin };
