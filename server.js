const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const authRoutes = require("./routes/authRoutes");

app.use("/api/v1/", authRoutes);

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
