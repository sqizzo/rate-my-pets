require("dotenv").config();
// Express: Web server
const express = require("express");

// Passport
const passport = require("passport");

// Mongoose: ODM for MongoDB
const mongoose = require("mongoose");
// Morgan: Logger
const morgan = require("morgan");

// Cors: For front end accessing API
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Routing
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");
const resetPasswordRouter = require("./Routes/passwordReset");

// passport require
require("./config/passport");

// Making server object
const app = express();

// Allow access for another project/domain like the frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// For reading JSON from body request
app.use(express.json());

app.use(passport.initialize());

// Morgan for Logging
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Routes
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/reset_password", resetPasswordRouter);

// Testing
app.get("/", (req, res) => {
  res.send("RateMyPets API is running!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`---- START ----
Connection to MongoDB was established!
Server running on port ${PORT}
Logging started :)
---- LOG ----`);
    });
  })
  .catch((err) => {
    console.log("Connection to MongoDB was failed:", err.message);
  });

// Routing
