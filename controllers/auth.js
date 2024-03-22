const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD
  }
})
//register
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Register Page",
    errorMsg: req.flash("error"),
  });
};

//handle register
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email Already Exists");
        return res.redirect("/register");
      }
      return bcrypt.hash(password, 10).then((hashPassword) => {
        return User.create({
          email,
          password: hashPassword,
        }).then((_) => {
          res.redirect("/login");
          transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Register Success!",
            html: "<h1>Register Account Successful.</h1><p>Login by using this email</p>"
          })
        });
      });
    })
    .catch((err) => console.log(err));
};
//login
exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login Page",
    errorMsg: req.flash("error"),
  });
};

exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "User Info Does Not Match! Try Again!!!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.userInfo = user;
            return req.session.save((err) => {
              res.redirect("/");
              console.log(err);
            });
          }
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};
