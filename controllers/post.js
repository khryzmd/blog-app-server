// Dependencies and Modules
const Post = require("../models/Post");
const { errorHandler } = require("../auth");

// Create a post
module.exports.addPost = (req, res) => {
  let newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author: {
      email: req.user.email,
    },
  });

  return Post.findOne({ name: req.body.title })
    .then((existingPost) => {
      if (existingPost) {
        return res.status(409).send({ message: "Post already exists" });
      } else {
        return newPost
          .save()
          .then((result) =>
            res.status(201).send({
              message: "Post successfully added",
              post: result,
            })
          )
          .catch((err) => errorHandler(err, req, res));
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

// Retrieve all posts
module.exports.getAllPosts = (req, res) => {
  return Post.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({
          posts: result,
        });
      } else {
        return res.status(404).send({ message: "No posts found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Retrieve a single post
module.exports.getPost = (req, res) => {
  return Post.findById(req.params.postId)
    .then((post) =>
      res.status(200).send({
        post: post,
      })
    )
    .catch((err) => errorHandler(err, req, res));
};

// Update post
module.exports.updatePost = (req, res) => {
  let updatedPost = {
    title: req.body.title,
    content: req.body.content,
  };

  return Post.findByIdAndUpdate(req.params.postId, updatedPost, { new: true })
    .then((post) => {
      if (post) {
        res.status(200).send({
          message: "Post updated successfully",
          updatedPost: post,
        });
      } else {
        res.send(false);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Delete a post
module.exports.deletePost = (req, res) => {
  return Post.findByIdAndDelete(req.params.postId)
    .then((result) => {
      if (result) {
        res.status(200).send({
          message: "Post deleted successfully",
        });
      } else {
        res.send(false);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Delete a comment
module.exports.deleteComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      // Find the index of the comment to delete
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === commentId
      );

      if (commentIndex === -1) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Remove the comment from the array
      post.comments.splice(commentIndex, 1);

      return post
        .save()
        .then(() =>
          res.status(200).send({ message: "Comment deleted successfully" })
        )
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((error) => errorHandler(error, req, res));
};

// Add comment
module.exports.addComment = (req, res) => {
  const postId = req.params.postId;

  return Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      post.comments.push({
        email: req.user.email,
        comment: req.body.comment,
      });
      return post
        .save()
        .then((commentedPost) =>
          res.status(200).send({
            message: "comment added successfully",
            updatedPost: commentedPost,
          })
        )
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((error) => errorHandler(error, req, res));
};

// Retrieve all comments
module.exports.getComments = (req, res) => {
  const postId = req.params.postId;

  return Post.findById(postId)
    .then((post) => res.status(200).send(post.comments))
    .catch((err) => errorHandler(err, req, res));
};

// Search for posts by their names
module.exports.searchPostsByName = async (req, res) => {
  try {
    const { postTitle } = req.body;

    const posts = await Post.find({
      title: { $regex: postTitle, $options: "i" },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
