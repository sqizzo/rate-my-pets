// Express: Web server
const express = require("express");
// Mongoose: ODM for MongoDB
const mongoose = require("mongoose");
// Morgan: Logger
const morgan = require("morgan");

// Cors: For front end accessing API
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Routing
const postsRouter = require("./Routes/posts");
const commentsRouter = require("./Routes/comments");
const authRouter = require("./Routes/auth");

// .Env config variable
require("dotenv").config();

// Making server object
const app = express();

// Allow access for another project/domain like the frontend
app.use(cors());

// For reading JSON from body request
app.use(express.json());

// Morgan for Logging
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Routes
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);

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
