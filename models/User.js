const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastNme:{
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
    address:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin", "User", "Delivery"],
        required:true,
    },
    additionDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:Profile
    },
    token:{
        type:String,
    },
    resetPasswordExpire:{
        type:Date,
    },

});

module.exports = mongoose.model("User", userSchema);