const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const manualConntroller = require('../controllers/manual.js');
const multer = require('multer');
const path = require('path');
const express = require('express');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

router.get('/', manualConntroller.getAllManuals);
router.get('/:id', manualConntroller.getManualById);
router.post('/create', upload.single('document'), isAuthenticated, manualConntroller.createManual);
router.get('/by-solution/:id', manualConntroller.getManualsBySolution);


module.exports = router;
