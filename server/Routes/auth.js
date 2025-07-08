const express = require("express");
const router = express.Router();

const User = require("../models/User");

// bcrypt for hashing password
const bcrypt = require("bcrypt");

// JWT
const jwt = require("jsonwebtoken");

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

    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
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
    const isUserNameExists = await User.findOne({ username: usernameTrimmed });

    if (isEmailExists || isUserNameExists) {
      return res.status(400).json({ error: "User/email already exist!" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordTrimmed, saltRounds);
    const newUser = await User.create({
      username: usernameTrimmed,
      email: emailTrimmed,
      passwordHash,
    });

    res.status(201).json({
      message: "User registered succesfully",
      userId: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    res.status(500).json({ error: "Cannot register to server" });
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
