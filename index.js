const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {cloudinaryConnect} = require("./config/cloudinaryConnect")
const database = require("./config/database");
const app = express()

//multer

var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })


// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));



// const fileUpload = require("express-fileUpload")
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const productRoutes = require("./routes/product")
const contactRoutes = require("./routes/contact")
const paymentRoutes = require("./routes/payment");
const { uploadImageTOCloudinary } = require("./utils/imageUploader");
const PORT = process.env.PORT || 4000;

require("dotenv").config();


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

database.connect()


//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contact", contactRoutes);



app.get("/", (req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running...."
    });
});


app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`);
})