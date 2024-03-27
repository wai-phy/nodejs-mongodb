const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/auth");

//register
router.get("/register", authController.getRegisterPage);
//register
router.post(
  "/register",
  body("email")
    .isEmail()
    .withMessage("Please Enter Valid Email Address!")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(
            "Email is already existed! Please Enter Another One"
          );
        }
      });
    }),
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must be at least 4 characters"),
  authController.registerAccount
);
//login
router.get("/login", authController.getLoginPage);
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter valid email."),
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Wrong Password! Please Try Again"),
  authController.postLoginData
);
router.post("/logout", authController.logout);

//reset password page
router.get("/reset-password", authController.getResetPage);

//reset password feedback
router.get("/feedback", authController.getFeedbackPage);

//reset password
router.post("/reset", authController.mailSendPassword);

//change password page
router.get("/reset-password/:token", authController.getNewPassPage);

//change new password
router.post(
  "/change-new-password",
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must be at least 4 characters"),body("confirm_password").trim().custom((value,{req})=>{
      if(value !== req.body.password){
        throw new Error("Password does not match! Please try again...")
      }
      return true;
    }),
  authController.changeNewPassword
);
module.exports = router;
