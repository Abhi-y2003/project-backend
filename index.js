const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {cloudinaryConnect} = require("./config/cloudinaryConnect")
const database = require("./config/database");
// const fileUpload = require("express-fileUpload")
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const productRoutes = require("./routes/product")
const contactRoutes = require("./routes/contact")
const paymentRoutes = require("./routes/payment")
const PORT = process.env.PORT || 4000;

require("dotenv").config();
const app = express()

app.use(express.json())
app.use(cookieParser())

database.connect()


//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", productRoutes);
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