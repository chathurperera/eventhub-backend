/* eslint-disable object-curly-spacing */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const jwtSecret = process.env.JWT_SECRET;

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  //Input validations
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  //Looking for duplicate accounts
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  //Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  //Creating the user
  const { _doc } = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  //Extracting user details without the password
  const { password: pw, ...userDetails } = _doc;

  //Generating the token
  const accessToken = jwt.sign(
    {
      id: userDetails._id,
    },
    jwtSecret,
    { expiresIn: "1d" }
  );

  res.status(201).json({
    data: {
      ...userDetails,
      accessToken,
    },
    statusCode: 201,
    message: "Registration successful",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Verifying the account existence
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(400).json({ message: "User doesn't exists" });
  }

  //Verifying the password
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //Generating the token
  const accessToken = jwt.sign(
    {
      id: foundUser._id,
    },
    jwtSecret,
    { expiresIn: "1d" }
  );

  const user = {
    email: foundUser.email,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
  };

  res.status(200).json({
    data: { accessToken, ...user },
    statusCode: 200,
    message: "Authentication successful",
  });
});

module.exports = {
  register,
  login,
};
