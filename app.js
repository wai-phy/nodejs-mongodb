const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const app = express();

const User = require("./models/user");

app.use(express.json());

const postRoutes = require("./routes/post");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth")
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("65f5b93f8aaf049f23c1d5c6").then((user) => {
    req.user = user;
    next();
  });
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(postRoutes);
app.use("/admin", adminRoute);
app.use(authRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("mongodb connected");
    return User.findOne()
      .then((user) => {
        if (!user) {
          return User.create({
            username: "WaiGyi",
            email: "waigyi@gmail.com",
            password: "12345",
          });
        }
        return user;
      })
      .then((result) => console.log(result));
  })
  .catch((err) => console.log(err));
