//  Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../auth.js");
const { errorHandler } = auth;

//  User Registration
module.exports.registerUser = (req, res) => {
  // Checks if the email is in the right format
  if (!req.body.email.includes("@")) {
    return res.status(400).send({
      error: "Email invalid",
    });
  }
  // Checks if the password has atleast 8 characters
  else if (req.body.password.length < 8) {
    return res.status(400).send({
      error: "Password must be atleast 8 characters",
    });
    // If all needed requirements are achieved
  } else {
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((result) =>
        res.status(201).send({
          message: "Registered Successfully",
        })
      )
      .catch((error) => errorHandler(error, req, res));
  }
};

//  User authentication
module.exports.loginUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({
      error: "Invalid Email",
    });
  }

  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({
          error: "No Email Found",
        });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          return res
            .status(200)
            .send({ access: auth.createAccessToken(result) });
        } else {
          return res.status(401).send({
            message: "Incorrect email or password",
          });
        }
      }
    })
    .catch((err) => errorHandler(error, req, res));
};

// Retrieve user details
module.exports.getDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      } else {
        user.password = "";
        return res.status(200).send({
          user: user,
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function to reset the user password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const { id } = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { username } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
