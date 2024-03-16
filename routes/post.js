const express = require("express");
const path = require("path");

const router = express.Router();

const postController = require("../controllers/post");

router.get("/", postController.renderHomePage);
router.get("/post/:id", postController.getPost);

module.exports = router;
