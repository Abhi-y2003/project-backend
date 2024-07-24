const mongoose =require("mongoose")

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        require:true,
        trim:true,
    },
    productDescription:{
        type:String,
        require:true,
        trim:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    price:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model("Product", productSchema)