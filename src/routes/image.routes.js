const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const ImageController = require('../controllers/image.js');
const multer = require("multer");
const upload = multer({ dest: "/tmp" });



router.post("/upload", upload.single("logo"), async (req, res) => {
    const result = await ImageController.uploadImage(req, res);
    res.status(200).send({ logo: result });
});

router.post('/upload-multiple', upload.array('photos', 10), async (req, res) => {
    try {
        const imageUrls = await Promise.all(req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: `${file.filename}_profile`,
                width: 500,
                height: 500,
                crop: "fill",
            });
            return result.url;
        }));

        res.status(200).json({ photos: imageUrls });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading files', error });
    }
});



module.exports = router;
