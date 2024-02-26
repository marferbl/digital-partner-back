const User = require('../models/user');
const Freelance = require('../models/freelance');

exports.getFreelance = async (req, res) => {
    try {
        const freelance = await Freelance.findOne({ _user: req.payload._id });
        res.status(200).send({ success: true, freelance });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.createFreelance = async (req, res) => {
    try {
        const freelance = await Freelance.create({ _user: req.payload._id, ...req.body });
        res.status(200).send({ success: true, freelance });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.updateFreelance = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const freelance = await Freelance
            .findOneAndUpdate({ user: user.id }, { ...req.body }, { new: true });
        res.status(200).send({ success: true, freelance });

    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.deleteFreelance = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const freelance = await Freelance.findOneAndRemove({ user: user.id });
        return { success: true, freelance };
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}




