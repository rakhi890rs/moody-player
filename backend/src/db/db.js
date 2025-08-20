const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("connected to mongoDB");
    })
    .catch((err)=>{
        console.error('error',err);
        
    });
}

module.exports = connectDB;