const User = require("../models/User");
const Profile = require('../models/Profile')
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//SendOTP Auth

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    var otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated:", otp);

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);

    console.log("OTP Body:", otpBody);

    res.status(200).json({
      success: true,
      message: "otp send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    console.log("Error in otp Send Auth");
  }
};

// exports.signUp = async (req, res) => {
//   try {
//     //data fetching
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmPassword,
//       accountType,
//       mobileNumber,
//       otp,
//     } = req.body;

//     //data validating

//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !otp ||
//       !accountType ||
//       !mobileNumber ||
//       !password ||
//       !confirmPassword
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     //password matching

//     if (password !== confirmPassword) {
//       return res.status(403).json({
//         success: false,
//         message: "Password and confirm password does not matched",
//       });
//     }
//     // check user exits

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(403).json({
//         success: false,
//         message: "user already exist",
//       });
//     }

//     //find most recent otp
//     console.log(email);
//     const otpExist = await OTP.findOne({ email });
//     console.log(otpExist);

   

//     
//     console.log("Provided OTP:", otp);
//     console.log("Retrieved OTP Document:", recentOtp);
//     console.log("Retrieved OTP:", recentOtp?.otp);

//     //otp validation
//     if (recentOtp.length === 0) {
//       //otp not found
//       return res.status(403).json({
//         success: false,
//         message: "Otp not found",
//       });
//     } else if (otp !== recentOtp?.otp) {
//       //Invalid Otp
//       return res.status(401).json({
//         success: false,
//         message: "otp does not match",
//       });
//     }

//     //Hash password

//     const hashedPassword = await bcrypt.hash(password, 10);

//     //entry in Db

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       mobileNumber,
//       password: hashedPassword,
//       accountType,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
//     });
//     //return response
//     return res.status(200).json({
//       success: true,
//       message: "Signup successfully Done",
//       user,
//     });
//   } catch (error) {
//     console.log("Error in signup process");
//     return res.status(500).json({
//       success: false,
//       message: "User not registered Error",
//     });
//   }
// };


exports.signUp = async (req,res) =>{


  try {
      const{
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          accountType,
          mobileNumber,
          otp }
          = req.body;
  
  
      if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
          return res.status(403).json({
              success:false,
              message:"All fields are required"
          })
      }
  
      //checking 2 passwords
      if(password !== confirmPassword){
          return res.status(400).json({
              success:false,
              message:"Password is not  same"
          })
      }
  
      const userExist = await User.findOne({email});
      console.log(userExist);
  
      if(userExist){
          return res.status(400).json({
              success:false,
              message:"User Already exist"
          })
      }
      
  
      //finding the most recent opt stored for login
      //.sort({createdAt: -1}): Sorts the documents in the collection by the createdAt field in descending order. 
      //.limit(1): Limits the results to one document.
      
      const recentOtp = await OTP.findOne({email}).sort({createdAt: -1,});
      const response = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
      console.log(response);
      console.log(recentOtp);
     
      //validating otp
      if(!response){
          //otp not found
          return res.status(400).json({
              success:false,
              message:"Otp not found"
          })
      }else if (otp !== response?.otp){
          return res.status(400).json({
              success:false,
              message:"OTP does not match"
          })
      }

      
      //hashing the password

      const hashedPassword = await bcrypt.hash(password, 10);


     
      //create a entry in Db

      console.log("here")

      const profileDetails = await Profile.create({
        gender: null,
        about: null,
        anotherAddress: null,
      })

      console.log(profileDetails);

      
      const user = await User.create({
          firstName,
          lastName,
          email,
          mobileNumber,
          password: hashedPassword,
          accountType: accountType,
          additionalDetails: profileDetails._id,
          image: `https://api.dicebaear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      })

      

      return res.status(200).json({
          success:true,
          message:"Signup successful",
          user,
      })
  

      
  } catch (error) {
      console.error(error);
      return res.status(401).json({
          success:false,
          message:"Error in sign up form "
      })
  }
}



exports.login = async (req, res) => {
  try {
    //data fetching
    const { email, password } = req.body;

    //empty fileds
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    //user in db exists

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not exist Please signup First",
      });
    }

    //generate JWT after password matching

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password doesnt match",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in login",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    //get data
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    //old password , new password , confirm new password
    //validation
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (oldPassword === newPassword || oldPassword === confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "Password must not be same as oldPassword",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "New password must be same",
      });
    }

    //checking the user in db
    const isUserExist = User.findOne({ email });

    if (!isUserExist) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist please Signup first",
      });
    } else if (isUserExist) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //update in db
      const updatePassword = await User.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );
    }
    //send mail

    //return res
    return res.status(200).json({
      success: true,
      message: "Password has Changed",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error in Password Change code",
    });
  }
};
