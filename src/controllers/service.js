const Corporate = require('../models/corporate');
const Service = require('../models/service');
const Solution = require('../models/solution');

exports.getServiceByUserCorporate = async (req, res) => {
    try {
        const services = await
            Service.find({ createdBy: req.payload._id }).populate(['solutionId', 'corporate']);
        res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.createService = async (req, res) => {
    try {
        const corporateById = await Corporate.findOne({ superadmin: req.payload._id });
        const service = await Service.create({ ...req.body, createdBy: req.payload._id, corporate: corporateById._id });
        res.status(200).send({ success: true, service });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate({
            path: 'corporate',
            populate: { path: 'superadmin' }
        }).populate('solutionId');
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

exports.deleteService = async (req, res) => {
    try {
        await Service.findOneAndDelete({ _id: req.params.id });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}


exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate
            (req.params.id, {
                ...req.body
            }, { new: true });
        res.status(200).send({ success: true, service });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getAllServicesFilter = async (req, res) => {
    try {
        const term = req.query.term;
        const partnerType = req.query.partnerType;
        const languages = req.query.languages;
        const countries = req.query.countries;
        const lineType = req.query.lineType;
        const serviceType = req.query.serviceType;

        let filter = {};

        if (term) {
            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
                { web: { $regex: term, $options: 'i' } },
            ];
        }

        if (lineType) {
            filter.lineType = lineType;
        }

        if (languages) {
            filter.languages = { $in: languages }; // Wrap the string in an array to use $in
        }

        if (serviceType) {
            filter.serviceType = { $in: [serviceType] }; // Wrap the string in an array to use $in
        }

        if (partnerType) {
            filter.partnerType = { $in: partnerType }; // Wrap the string in an array to use $in
        }

        if (countries) {
            filter.countries = { $in: countries }; // Wrap the string in an array to use $in
        }

        const services = await Service.find({ ...filter }).populate(['solutionId', 'corporate'])
        return services;

        // res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong', error });
    }
};