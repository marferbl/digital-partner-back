const Corporate = require('../models/corporate');
const User = require('../models/user');

exports.getCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        res.status(200).send({ success: true, corporate });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
};

exports.createCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.payload._id });
        const corporate = await Corporate.create({ superadmin: user.id, ...req.body });
        res.status(200).send({ success: true, corporate });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.updateCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.payload._id });
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
        const user = await User.findOne({ id: req.payload._id });
        const corporate = await Corporate.findOneAndRemove({ superadmin: user.id });
        return { success: true, corporate };
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}


