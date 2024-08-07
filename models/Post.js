const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
  },
  comments: [
    {
      email: {
        type: String,
        required: [true, "email is required"],
      },
      comment: {
        type: String,
        required: [true, "comment is required"],
      },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
