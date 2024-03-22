const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const { isLoginMiddleware } = require("./middleware/is-login");
const csrf = require('csurf');
const flash = require("connect-flash");


const store = new mongoStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtect = csrf();

const app = express();
const User = require("./models/user");

app.use(express.json());

//routes
const postRoutes = require("./routes/post");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// middleware
app.use((req, res, next) => {
  if (req.session.isLogin === undefined) {
    return next();
  }
  User.findById(req.session.userInfo._id)
    .select("_id email")
    .then((user) => {
      req.user = user;
      next();
    });
});

app.use(csrfProtect);

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin ? true : false,
  res.locals.csrfToken = req.csrfToken();
  next();
});
//flash 
app.use(flash())
app.use(postRoutes);
app.use("/admin", isLoginMiddleware, adminRoute);
app.use(authRoute);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("mongodb connected");
  })
  // .then((result) => console.log(result))
  .catch((err) => console.log(err));
