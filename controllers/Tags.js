const Tag = require("../models/tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //entry creation

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    return res.status(200).json({
        success: true,
        message: "Tag Created",
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Tag creation failed",
    });
  }
};


//get All tags

exports.showAllTags = async(req,res)=>{
    try {
        
        const allTags = Tag.find({},{name:true,description:true})

        console.log(allTags)

        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
        
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Show all tags Error",
          });
    }
}