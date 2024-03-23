const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const crypto = require("crypto");
const e = require("connect-flash");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
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
            html: "<h1>Register Account Successful.</h1><p>Login by using this email</p>",
          });
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

//reset password
exports.getResetPage = (req, res) => {
  res.render("auth/forgot", {
    title: "Reset Password",
    errorMsg: req.flash("error"),
  });
};

//reset password mail send
exports.mailSendPassword = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, burrer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = burrer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account With This Email Found!!");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/feedback");
        transporter.sendMail({
          from: process.env.SENDER_MAIL,
          to: email,
          subject: "Reset Password",
          html: `<h1>Reset Password.</h1><p>Change your account password by clicking the link below</p><a href="http://localhost:8080/reset-password/${token}" target='_blank'>Click Here To Change Password</a>`,
        });
      })
      .catch((err) => console.log(err));
  });
};

//feedback page after reset password
exports.getFeedbackPage = (req, res) => {
  res.render("auth/feedback", { title: "Feedback Page" });
};

exports.getNewPassPage = (req, res) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
  .then((user) => {
      // console.log(user)
      if (user) {
        res.render("auth/new-password", {
          title: "New Password",
          errorMsg: req.flash("error"),
          resetToken: token,
          user_id: user._id,
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => console.log(err));
};

exports.changeNewPassword = (req, res) => {
  const { password, confirm_password, user_id, resetToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken,
    tokenExpiration: { $gt: Date.now() },
    _id: user_id,
  })
    .then((user) => {
      if (password === confirm_password) {
        resetUser = user;
        return bcrypt.hash(password, 10);
      }
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("login");
    })
    .catch((err) => console.log(err));
};
