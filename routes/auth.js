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

module.exports = router;
