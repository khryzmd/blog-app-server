// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

//  Route for user registration
router.post("/register", userController.registerUser);

//  Route for user authentication
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getDetails);

// PATCH route for reseting the password
router.patch('/reset-password', verify, userController.resetPassword);

// Update user profile route
router.put('/profile', verify, userController.updateProfile);

//  Export Route System
module.exports = router;