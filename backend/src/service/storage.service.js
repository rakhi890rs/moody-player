var ImageKit = require("imagekit");
var mongoose = require("mongoose");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

function uploadFile(file){
    return new Promise((resolve, reject) => {
     
        const uniqueId = new mongoose.Types.ObjectId().toString();

        imagekit.upload({
            file: file.buffer,
            fileName: uniqueId + "_" + file.originalname,
            folder: "audio"
        }, (error, result) => {
            if(error){
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = uploadFile;
