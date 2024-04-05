const express = require("express");
const path = require("path");
const { body } = require("express-validator");

const router = express.Router();
const postController = require("../controllers/post");

router.get("/create", postController.renderCreatePage);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must be at least 10 letters"),
    body("imgUrl").isURL().withMessage("Image is must be URl Link"),
    body("description")
      .isLength({ min: 30 })
      .withMessage("Description must be at least 30 letters"),
  ],
  postController.createPost
);
//admin/post/id
router.post("/post/:id", postController.deletePost);

router.get("/post_edit/:id", postController.getEditPost);
router.post(
  "/post-edit",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must be at least 10 letters"),
    body("imgUrl").isURL().withMessage("Image is must be URl Link"),
    body("description")
      .isLength({ min: 30 })
      .withMessage("Description must be at least 30 letters"),
  ],
  postController.updatePost
);

module.exports = router;
