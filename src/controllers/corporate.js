const Corporate = require('../models/corporate');
const User = require('../models/user');
const CompanyApplications = require('../models/company-applications');

exports.getCorporate = async (req, res) => {
    try {
        const corporate = await Corporate.findOne({ superadmin: req.payload._id });
        res.status(200).send({ success: true, corporate });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
};

exports.createCorporate = async (req, res) => {
    try {
        const { plan } = req.body;
        const corporate = await Corporate.create({ superadmin: req.payload._id, ...req.body });
        let form = {};
        if (plan === 'seller') {
            form = { corporateId: corporate._id, solutions: true, services: true, events: true, teamManagement: false, licenses: false, recruitment: false };
        } else if (plan === 'buyer') {
            form = { corporateId: corporate._id, solutions: false, services: false, events: false, teamManagement: true, licenses: true, recruitment: true };
        } else {
            form = { corporateId: corporate._id, solutions: true, services: true, events: true, teamManagement: true, licenses: true, recruitment: true };
        }
        await CompanyApplications.create(form);

        res.status(200).send({ success: true, corporate });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.updateCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate
            .findOneAndUpdate({ superadmin: user.id }, { ...req.body }, { new: true });
        res.status(200).send({ success: true, corporate });

    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
};

exports.deleteCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate.findOneAndRemove({ superadmin: user.id });
        return { success: true, corporate };
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getApplications = async (req, res) => {
    try {
        const applications = await CompanyApplications.findOne({ corporateId: req.params.id });
        res.status(200).send({ success: true, applications });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}


