const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

const postRoutes = require("./routes/post");
const adminRoute = require("./routes/admin");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(postRoutes);
app.use("/admin", adminRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongodb connected");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
