const Corporate = require('../models/corporate');
const Service = require('../models/service');
const Solution = require('../models/solution');

exports.getServiceByUserCorporate = async (req, res) => {
    try {
        const services = await
            Service.find({ createdBy: req.payload._id }).populate('solutionId');
        res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.createService = async (req, res) => {
    try {
        const corporateById = await Corporate.findOne({ superAdmin: req.payload._id });
        const service = await Service.create({ ...req.body, createdBy: req.payload._id, corporate: corporateById._id });
        res.status(200).send({ success: true, service });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('solutionId');
        res.status(200).send({ success: true, service });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getServicesBySolution = async (req, res) => {
    try {
        const services = await Service.find({ solutionId: req.params.id }).populate('corporate')
        res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate
            (req.params.id, {
                ...req
                    .body
            }, { new: true });
        res.status(200).send({ success: true, service });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}