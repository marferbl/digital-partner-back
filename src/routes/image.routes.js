const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const ImageController = require('../controllers/image.js');
const multer = require("multer");
const upload = multer({ dest: "/tmp" });



router.post("/upload", upload.single("logo"), async (req, res) => {
    const result = await ImageController.uploadImage(req, res);
    res.status(200).send({ logo: result });
});



module.exports = router;
