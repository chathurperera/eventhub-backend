/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
const connectDB = require("./config/db");
connectDB(process.env.MONGO_URI);

//CONNECTING TO THE DATABASE
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}...`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
