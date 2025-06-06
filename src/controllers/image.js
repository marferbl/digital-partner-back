const cloudinary = require('../helper/imageUpload')

exports.uploadImage = async (req, res) => {
    const width = req.body.width
    const height = req.body.height
    const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${req.file.filename}_profile`,
        width: width || 500,
        height: height || 500,
        crop: "fill",
    });
    return result.url
}
