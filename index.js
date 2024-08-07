// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Environment Setup
require("dotenv").config();

// Server setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// Backend Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Server Gateway Response
if (require.main === module) {
  app.listen(process.env.PORT || 4003, () =>
    console.log(`API is now online on port ${process.env.PORT || 4003}`)
  );
}

module.exports = { app, mongoose };
