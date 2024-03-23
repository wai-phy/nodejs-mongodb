const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

//register
router.get("/register", authController.getRegisterPage);
//register
router.post("/register", authController.registerAccount);
//login
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginData);
router.post("/logout", authController.logout);

//reset password page
router.get("/reset-password", authController.getResetPage);

//reset password feedback
router.get("/feedback", authController.getFeedbackPage);

//reset password
router.post("/reset", authController.mailSendPassword);

//change password page
router.get("/reset-password/:token", authController.getNewPassPage)

//change new password 
router.post("/change-new-password", authController.changeNewPassword);
module.exports = router;
