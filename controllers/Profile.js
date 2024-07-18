const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { email = "", anotherAddress, gender } = req.body;

    const id = req.user.id;

    if (!contactNumber || !id) {
      return res.status(403).json({
        success: false,
        message: "Please fill mandatory fields",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionDetails;

    const profileDetails = await User.findById(profileId);

    profileDetails.email = email;
    profileDetails.anotherAddress = anotherAddress;
    profileDetails.gender = gender;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: " Additional Profile updated",
      profileDetails,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Error in profile section",
    });
  }
};

//delete account

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "Not a valid User",
      });
    }

    await Profile.findByIdAndDelete({ _id: userDetails.additionDetails });

    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Error in Account deletion",
    });
  }
};



exports.getAllUserDetails = async(req,res)=>{
    
}
