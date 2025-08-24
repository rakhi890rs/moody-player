const express = require('express');
const songRoutes = require('./routes/song.routes')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.send("hello rakhi backend is ready");
// });


app.use('/api',songRoutes);



module.exports= app;