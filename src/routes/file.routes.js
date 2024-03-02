const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../path/to/pdf/files', filename); // Adjust the path to your PDF files

    // Set Content-Disposition header to force download with correct filename
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Send the file as binary data
    res.sendFile(filePath);
});

module.exports = router;