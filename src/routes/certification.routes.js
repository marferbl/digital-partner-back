const router = require("express").Router();
const certificationController = require('../controllers/certification.js');
const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/solution/:id", isAuthenticated, async (req, res) => {
    certificationController.getCertifications(req, res);
});

router.post("/create", isAuthenticated, async (req, res) => {
    certificationController.createCertification(req, res);
});




module.exports = router;
