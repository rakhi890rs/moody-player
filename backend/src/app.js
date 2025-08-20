const express = require('express');

const app = express();

app.get("/",(req,res)=>{
    res.send("hello rakhi backend is ready");
});




module.exports= app;