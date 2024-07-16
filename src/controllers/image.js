const cloudinary = require('../helper/imageUpload')

exports.uploadImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${req.file.filename}_profile`,
        width: 500,
        height: 500,
        crop: "fill",
    });
    return result.url
} 