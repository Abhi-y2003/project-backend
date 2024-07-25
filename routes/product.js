const express = require("express")
const router = express.Router();


const{createProduct, showAllProducts , getProductDetails} = require("../controllers/Product")

const{createCategory, showAllCategory} = require("../controllers/Categories");


//importing middlewares

const {auth , isCustomer , isDeliveryPartner, isAdmin } = require("../middlewares/auth")



router.post("/createProduct", auth, isAdmin, createProduct)

router.get("/showAllProducts", showAllProducts)

router.post("/getProductDetails", getProductDetails)


// Edit Product routes
//router.post("/editCourse", auth, isAdmin, editProduct)

// Delete a Product
//router.delete("/deleteProduct", deleteProduct)

//Category Routes

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategory", showAllCategory)



module.exports = router