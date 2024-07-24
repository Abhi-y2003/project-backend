const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:Number,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    address:{
        type:String,
        // required:true
    },
    accountType:{
        type:String,
        enum:["Admin", "User", "Delivery"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        //required:true,
        ref:"Profile"
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    userHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserHistory"
    },
    image:{
        type:String,
        require:true
    }

});

module.exports = mongoose.model("User", userSchema);