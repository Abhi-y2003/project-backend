const Product = require("../models/Product");
const Tag = require("../models/tags");
const User = require("../models/User");
const Category = require("../models/category")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config;

//CreateProduct
exports.createProduct = async (req, res) => {
  try {

    console.log("Hello")

    const { productName, productDescription, category , price } = req.body;

    console.log("Product Name is" , productName)
    
    const thumbnail = req.files.thumbnailImage;

    console.log("thumbnail is" , thumbnail)

    console.log("two three")

    // if(thumbnail){
    //   console.log("image got")
    // }

    //validation
    if (!productName || !productDescription || !category || !price ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.findOne({_id:category });

    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category please create a new category",
      });
    }

    // const thumbnailImage = await uploadImageToCloudinary(
    //   thumbnail,
    //   process.env.FOLDER_NAME
    // );

    console.log("four")

    const newProduct = await Product.create({
      productName: productName,
      productDescription: productDescription,
      category: category,
      price: price,
    });

    console.log("five")

    await Category.findOneAndUpdate(
      {_id:category },
      {
        $push: {
          product: newProduct._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "New product created",
      newProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in creating new Product",
    });
  }
};

//Get all products

exports.showAllProducts = async (req, res) => {
  try {
    const allProducts = Product.find(
      {},
      { productName, description, price, tag, thumbnail }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all Data",
      data:allProducts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in fetching all course Data",
    });
  }
};



exports.getProductDetails = async(req,res)=>{
   try {
    
    const {productId} = req.body
    const productDetails = Product.find({productId}).populate("category").exec()

    if(!productDetails){
      return res.status(400).json({
        success:false,
        message:"Error in getting/populating product details"
      })
    }

    return res.json({
      success:true,
      message:"Date found for specific Product ID"
    })
   } catch (error) {
    return res.status(400).json({
      success:false,
      message:"Error in getting All product details"
    })
   }
}

