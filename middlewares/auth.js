const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User")

//auth
exports.auth = async(req,res,next) =>{
try {
    
    //extract token
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

    if(!token){
        return res.status(400).json({
            success:false,
            message:"Token is missing"
    })
    }

    //verify the token
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
        req.user = decode

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Jwt verification issue"
    })
    }

    next()

} catch (error) {
    return res.status(401).json({
        success:false,
        message:"AUTH verification issue"
})
}
}


//Customer verification

exports.isCustomer = async(req,res, next) =>{
    try {

        if(req.user.accountType !== "Customer"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Customers only"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Customer middleware issue"
})
    }
} 



//Delivery Partner

exports.isDeliveryPartner = async(req,res, next) =>{
    try {

        if(req.user.accountType !== "Delivery Partner"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Delivery Partner only"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Delivery  middleware issue"
})
    }
} 


//Admin

exports.isAdmin = async(req,res, next) =>{
    try {

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Admin  middleware issue"
})
    }
} 