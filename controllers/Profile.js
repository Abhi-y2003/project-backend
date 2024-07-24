const Profile = require("../models/Profile");
const User = require("../models/User");


exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      about = "",
      anotherAddress = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.about = about
    profile.anotherAddress = anotherAddress
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// exports.updateProfile = async (req, res) => {
//   try {
//     const {  about, gender , anotherAddress="" } = req.body;

//     console.log("Hello")

//     const id = req.user.id;
//     console.log(id)

//     console.log("Hello2")

//     if (!gender || !id) {
//       return res.status(403).json({
//         success: false,
//         message: "Please fill mandatory fields",
//       });
//     }
    
//     console.log("Hello3")

//     const userDetails = await User.findById(id);
//     console.log(userDetails.email)

//     const profileId = await Profile.findById(userDetails.additionalDetails);

//     console.log(profileId)

    
      
//       const profileDetails = await User.findById(profileId);

//       console.log(profileDetails)
//       if (!profileDetails) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       profileDetails.about = about;
//       profileDetails.anotherAddress = anotherAddress;
//       profileDetails.gender = gender;
  
//       await profileDetails.save();

//       res.status(200).json({
//         success:true,
//         msg:"profile details updated"

//       })

//     return res.status(200).json({
//       success: true,
//       message: " Additional Profile updated",
//       profileDetails,
//     });
//   } catch (error) {
//     return res.status(403).json({
//       success: false,
//       message: "Error in profile section",
//     });
//   }
// };

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

    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

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
    try{

      const id = req.user.id;

      const userDetails = await User.findById(id).populate("additionalDetails").exec();

      console.log(userDetails);

      return res.status(200).json({
        success:true,
        message:"User details found",
        userDetails
      })

    }catch(error){
      return res.status(200).json({
        success:false,
        message:"User details cant be populated"
      })
    }
}
