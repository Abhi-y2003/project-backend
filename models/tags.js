const mongoose = require("mongoose")

const tagsSchema = new mongoose.Schema({
    tag:{
        type:String,
        trim:true,
    }
    
})

module.exports = mongoose.model("Tag" , tagsSchema)