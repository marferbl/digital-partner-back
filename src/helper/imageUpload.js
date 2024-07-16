const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: '534851832658838',
    api_secret: process.env.CLOUDINARY_APP_SECRET
});

module.exports = cloudinary;