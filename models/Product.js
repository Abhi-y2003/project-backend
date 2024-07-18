const mongoose =require("mongoose")

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        trim:true,
    },
    // productId:{
    //     type:String,
    //     trim:true,
    // },
    description:{
        type:String,
        trim:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    price:{
        type:Number
    }
})


module.exports = mongoose.model("Product", productSchema)