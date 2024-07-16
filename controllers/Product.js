const Product = require("../models/Product")
const Tag = require("../models/tags");
const User = require("../models/User")
const {uploadImageToCloudinary} = require('../utils/imageUploader');
require("dotenv").config

//CreateProduct
exports.createProduct = async(req,res)=>{

    try {
        const {productName, productDescription, tag, price} = req.body;

        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!productName || !productDescription || !tag || !price || !thumbnail)  {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const tagDetails = await Tag.findOne({tag})

        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid Tag please create a new tag"
            })
        }

        const thumbnailImage =  await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newProduct =await Product.create({
            productName:productName,
            description:productDescription,
            tag:tag,
            price:price,
        }) 

    } catch (error) {
        
    }
}








//Get all products