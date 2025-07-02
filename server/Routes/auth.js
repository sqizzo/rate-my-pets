const express = require("express");
const router = express.Router();
const User = require("../models/User");

// bcrypt for hashing password
const bcrypt = require("bcrypt");

// JWT
const jwt = require("jsonwebtoken");

// Register user
// url: /register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, email, passwordHash });

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

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordCorrect = await bcrypt.compare(
      password,
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
