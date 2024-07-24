const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs/dist/bcrypt");

//resetPassword Token

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      return res.status(403).json({
        success: false,
        msg: "Not a Valid User",
      });
    }

    const token = crypto.randomUUID();

    console.log("Token is ", token);

    const updateUserDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    console.log("Update user details" , updateUserDetails)

    const url = `http://localhost:3000/update-password/${token}`;


    await mailSender(email, "Reset Password Link", url);

    return res.status(200).json({
      success: true,
      msg: "Email sent Successfully",
      token
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Reset token Error",
    });
  }
};

// Reseting the Password in Database

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }

    const userDetails = await User.findOne({ token: token });

    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "User not Found",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Session time out",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password Successfully reseted",
    });
  } catch (error) {
    return res.status(411).json({
      success: false,
      message: "Password reset Error",
    });
  }
};
