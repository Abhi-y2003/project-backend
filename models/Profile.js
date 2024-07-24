const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    about:{
        type:String,
        trim:true,
    },
    gender:{
        type:String,
        trim:true,
    },
    anotherAddress:{
        type:String,
    },
})

module.exports = mongoose.model("Profile" , profileSchema)