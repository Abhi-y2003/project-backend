const express = require("express")

require("dotenv").config();
const app = express()

database.connect()


app.get("/", (req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running...."
    });
});

app.listen(port, ()=>{
    console.log(`App is running on ${port}`);
})