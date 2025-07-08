const express = require("express");
const router = express.Router();

const User = require("../models/User");

// bcrypt for hashing password
const bcrypt = require("bcrypt");

// JWT
const jwt = require("jsonwebtoken");

// Crypto for generating verification tokens

const crypto = require("crypto");

const sendVerificationEmail = require("../utils/sendVerificationEmail");

// Passport
const passport = require("passport");

// Google OAuth 2.0
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const payload = {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

// Register user
// url: /register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing username/email/password" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Please provide a valid password" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email format" });
    }

    const emailTrimmed = email?.trim().toLowerCase();
    const usernameTrimmed = username?.trim();
    const passwordTrimmed = password?.trim();

    const isEmailExists = await User.findOne({ email: emailTrimmed });
    const isUserNameExists = await User.findOne({
      username: usernameTrimmed,
    });

    if (isEmailExists || isUserNameExists) {
      return res.status(400).json({ error: "User/email already exist!" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordTrimmed, saltRounds);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const newUser = await User.create({
      username: usernameTrimmed,
      email: emailTrimmed,
      passwordHash,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(
        emailTrimmed,
        verificationToken,
        usernameTrimmed
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      userId: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    res.status(500).json({ error: "Cannot register to server" });
  }
});

// Verify email
// url: /verify-email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing verification token" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Email verification failed" });
  }
});

// Resend verification email
// url: /resend-verification
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please provide a valid email" });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = expires;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.username);
      res.status(200).json({
        message: "Verification email sent successfully",
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({
        error: "Failed to send verification email",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
// url: /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  const emailTrimmed = email?.trim().toLowerCase();
  const passwordTrimmed = password?.trim();

  try {
    const userExist = await User.findOne({ email: emailTrimmed });
    if (!userExist) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordCorrect = await bcrypt.compare(
      passwordTrimmed,
      userExist.passwordHash
    );
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if email is verified
    if (!userExist.isEmailVerified) {
      return res.status(401).json({
        error: "Please verify your email address before logging in",
        needsVerification: true,
      });
    }

    const userForToken = {
      id: userExist._id,
      username: userExist.username,
      role: userExist.role,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      username: userExist.username,
      userId: userExist._id,
      role: userExist.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed. Server problem" });
  }
});

module.exports = router;
