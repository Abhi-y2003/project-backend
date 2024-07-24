const express = require("express")
const router = express.Router();

const {auth, isDeliveryPartner} = require("../middlewares/auth")
const {updateProfile, deleteAccount, getAllUserDetails} = require('../controllers/Profile');
const { resetPasswordToken } = require("../controllers/ResetPassword");


//Delete User Routes

router.delete("/deleteProfile", auth , deleteAccount);
router.post("/updateProfile", auth, updateProfile);
router.get("/getAllUserDetails", auth , getAllUserDetails);

//getting User history routes


//Delivery dashboard
router.get("/deliveryDashboard", auth, isDeliveryPartner)



//export
module.exports = router;