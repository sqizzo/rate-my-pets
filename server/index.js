// Express: Web server
const express = require("express");
// Mongoose: ODM for MongoDB
const mongoose = require("mongoose");

// Cors: For front end accessing API
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Routing
const postsRouter = require("./Routes/posts");

// .Env config variable
require("dotenv").config();

// Making server object
const app = express();

// Allow access for another project/domain like the frontend
app.use(cors());

// For reading JSON from body request
app.use(express.json());

// Routes
app.use("/api/posts", postsRouter);

// Testing
app.get("/", (req, res) => {
  res.send("RateMyPets API is running!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection to MongoDB was failed:", err.message);
  });

// Routing
