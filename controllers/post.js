const posts = [];
const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, imgUrl } = req.body;
  const post = new Post(title, description, imgUrl);
  post
    .create()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("create", { title: "Create Page" });
};
exports.renderHomePage = (req, res) => {
  Post.getPosts()
    .then((posts) => {
      res.render("home", { title: "Home Page", posts: posts });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const id = req.params.id;
  Post.getPost(id)
    .then((post) => {
      res.render("details", { title: "Detail Page", post: post });
    })
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const id = req.params.id;
  Post.getPost(id)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("edit", { title: "Edit Page", post: post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { id, title, description, imgUrl } = req.body;
  const post = new Post(title, description, imgUrl, id);
  post
    .create()
    .then((post) => {
      console.log("post updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  Post.deleteById(id)
    .then(() => {
      console.log("post deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
