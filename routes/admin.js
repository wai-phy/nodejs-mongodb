const express = require("express");
const path = require("path");

const router = express.Router();
const postController = require("../controllers/post")

router.get("/create", postController.renderCreatePage);

router.post("/",postController.createPost );
//admin/post/id
router.post("/post/:id", postController.deletePost);

router.get('/post_edit/:id', postController.getEditPost);
router.post('/post-edit', postController.updatePost);

module.exports = router;
