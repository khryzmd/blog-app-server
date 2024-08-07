// Dependencies and Modules
const express = require("express");
const postController = require("../controllers/post");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

// Route for creating a post
router.post("/addPost", verify, postController.addPost);

// Route for retrieving all posts
router.get("/getAllPosts", postController.getAllPosts);

// Route for retrieving a single post
router.get("/getPost/:postId", postController.getPost);

// Route for updating a post
router.patch("/updatePost/:postId", verify, postController.updatePost);

// Route to deleting a post
router.delete("/deletePost/:postId", verify, postController.deletePost);

// Route to deleting a comment
router.delete(
  "/deleteComment/:postId/:commentId",
  verify,
  verifyAdmin,
  postController.deleteComment
);

// Route for adding a comment
router.patch("/addComment/:postId", verify, postController.addComment);

// Route for retrieving all comment
router.get("/getComments/:postId", postController.getComments);

// Route for searching posts by their names
router.post("/search-by-name", postController.searchPostsByName);

// Export Route System
module.exports = router;
