const express = require("express");
const {mongoDbConnect} = require("./utils/database");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

const postRoutes = require("./routes/post");
const adminRoute = require("./routes/admin");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", (req, res, next) => {
    console.log("This is middleware admin");
    next();
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(postRoutes);
app.use("/admin", adminRoute);

mongoDbConnect();
app.listen(8080);

