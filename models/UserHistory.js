const mongoose = require("mongoose");

const userHistory = new mongoose.Schema({
    history:{
        type:String
    }
    
})

module.exports = mongoose.model("UserHistory", userHistory)