const mongoose = require("mongoose");

const userHistory = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
    
})

module.exports = mongoose.model("UserHistory", userHistory)