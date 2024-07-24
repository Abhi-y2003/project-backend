const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
    mobileNumber:{
        type:Number,
    },
    email:{

        type:String,
        required: true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }
})

//function to send Mail

async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email", otp)
        console.log("Email send Successfully:", mailResponse)
    } catch (error) {
        console.log("Error in Sending email")
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
    
})

module.exports = mongoose.model("OTP", OTPSchema);