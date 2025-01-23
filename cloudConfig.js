const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//configuring cloudinary with our cloud name,api key and api secret which we get from cloudinary website
    //confgure ka matlab hai ki hm cloudinary ko use krne k liye usme apni details dal rhe hai jaise ki cloud name,api key and api secret
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',//folder name where we want to store our images
      allowedFormats: ['jpeg', 'png', 'jpg'],//allowed formats of images
    },
  });

  module.exports = {
    cloudinary,
    storage
  };//exporting cloudinary and storage so that we can use it in other files
    