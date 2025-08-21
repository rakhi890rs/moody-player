const express = require('express');
const songRoutes = require('./routes/song.routes')

const app = express();
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.send("hello rakhi backend is ready");
// });


app.use('/',songRoutes);



module.exports= app;