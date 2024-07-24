const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //entry creation

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(200).json({
        success: true,
        message: "category Created",
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "category creation failed",
    });
  }
};


//get All category

exports.showAllCategory = async(req,res)=>{
    try {
        
        const allCategory = await Category.findOne({},{name:true,description:true})

        console.log(allCategory)

        return res.status(200).json({
            success:true,
            message:"All category returned successfully",
            allCategory,
        })
        
    } catch (error) {
        
        return res.status(400).json({
            success: false,
            message: "Show all category Error",
          });
    }
}