const Product = require("../models/Product");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config;

//CreateProduct
exports.createProduct = async (req, res) => {
  try {
    const { productName, productDescription, tag, price } = req.body;

    const thumbnail = req.files.thumbnailImage;

    //validation
    if (!productName || !productDescription || !tag || !price || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tagDetails = await Tag.findOne({ tag });

    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tag please create a new tag",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newProduct = await Product.create({
      productName: productName,
      description: productDescription,
      tag: tag,
      price: price,
      thumbnail: thumbnailImage.secure_url,
    });

    await Tag.findOneAndUpdate(
      { tag: tag },
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
