const express = require("express");

const router = express.Router();

//User Login
router.post("/login", login);