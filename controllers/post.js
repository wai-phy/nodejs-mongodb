const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, imgUrl } = req.body;
  Post.create({ title, description, imgUrl, userId: req.user })
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
  // const cookie = req.get("Cookie").split("=")[1].trim() === "true";
  // console.log(cookie)
  Post.find()
    .select("title")
    .populate("userId", "username")
    .sort({ _id: "desc" })
    .then((posts) => {
      console.log(posts);
      res.render("home", {
        title: "Home Page",
        posts: posts,
        isLogin: req.session.isLogin ? true : false,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      res.render("details", { title: "Detail Page", post: post });
    })
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const id = req.params.id;
  Post.findById(id)
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

  Post.findById(id)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.imgUrl = imgUrl;
      return post.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then(() => {
      console.log("post deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
