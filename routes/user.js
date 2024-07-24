const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPassword,
  resetPasswordToken,
} = require("../controllers/ResetPassword");


//Authentication Routes 

router.post("/login", login);
router.post("/signUp", signUp);
router.post("/sendOtp", sendOTP);
router.post("/changePassword", changePassword);


//Password Reset Routes
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);


//exporting it to main app
module.exports = router;
