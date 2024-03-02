
const Manual = require('../models/manual');

exports.getAllManuals = async (req, res) => {
    try {
        const manuals = await Manual.find();
        res.status(200).json(manuals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getManualById = async (req, res) => {
    try {
        const manual = await Manual.findById(req.params.id);
        res.status(200).json(manual);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createManual = async (req, res) => {
    try {
        const { name, solution } = req.body;
        const { file } = req;
        const manual = await Manual.create({ name, document: file.path, solution });
        res.status(201).json(manual);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getManualsBySolution = async (req, res) => {
    try {
        const manuals = await Manual.find({ solution: req.params.id });
        res.status(200).send({ success: true, manuals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




