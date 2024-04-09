const Certification = require('../models/certification');


exports.createCertification = async (req, res) => {
    try {
        const certification = await Certification.create(req.body);
        res.status(200).send({ success: true, certification });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find({ solution: req.params.id });
        res.status(200).send({ success: true, certifications });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}