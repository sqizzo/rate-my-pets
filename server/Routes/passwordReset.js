const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please provide a valid email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const expires = Date.now() + 1000 * 60 * 15;

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expires;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const message = {
      from: '"RateMyPets Support" <support@ratemypets.com>',
      to: user.email,
      subject: "Password reset request",
      html: `
      
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(message);

    res.status(200).json({ message: "Token generated and saved" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token in query" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "User not found or token already expired" });
  }

  res.status(200).json({
    message: "Token is valid",
    userId: user._id,
    email: user.email,
  });
});

router.post("/confirm", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ error: "Token and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Please provide a valid password" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  user.passwordHash = passwordHash;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

module.exports = router;
