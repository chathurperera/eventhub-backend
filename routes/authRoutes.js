const express = require("express");

const router = express.Router();
const { login } = require("../controllers/authController");

//User Login
router.post("/login", login);
