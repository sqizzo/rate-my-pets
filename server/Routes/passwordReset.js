const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email } = req.body;

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
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "kelli61@ethereal.email",
        pass: "tk1mjsywZy95ZU3ENj",
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

router.get("/", async (req, res) => {});

module.exports = router;
