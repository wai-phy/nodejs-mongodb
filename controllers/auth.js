const bcrypt = require("bcrypt");
const User = require("../models/user");
//register
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", { title: "Register Page" });
};

//handle register
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect("/register");
      }
      return bcrypt.hash(password, 10).then((hashPassword) => {
        return User.create({
          email,
          password: hashPassword,
        }).then((_) => {
          res.redirect("/login");
        });
      });
    })
    .catch((err) => console.log(err));
};
//login
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login Page" });
};

exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
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
