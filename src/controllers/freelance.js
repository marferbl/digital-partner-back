const User = require('../models/user');
const Freelance = require('../models/freelance');

exports.getFreelance = async (req, res) => {
    try {
        const freelance = await Freelance.findOne({ user: req.payload._id }).populate('user');
        res.status(200).send({ success: true, freelance });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getAllWithSearchAndFilters = async (req, res) => {
    try {
        const term = req.query.term;
        const salaryMax = req.query.salaryMax
        const salaryMin = req.query.salaryMin
        const position = req.query.job
        const city = req.query.city
        const country = req.query.country

        let filter = {};

        if (salaryMax && salaryMin) {
            filter.salary = { $gte: salaryMin, $lte: salaryMax };
        } else if (salaryMax) {
            filter.salary = { $lte: salaryMax };
        } else if (salaryMin) {
            filter.salary = { $gte: salaryMin };
        }

        if (position) {
            filter.job = position;
        }
        if (city) {
            filter.city = city;
        }
        if (country) {
            filter.country = country;
        }


        if (term) {
            filter.$or = [
                { fullName: { $regex: term, $options: 'i' } },
                { introduction: { $regex: term, $options: 'i' } },
                { aboutMe: { $regex: term, $options: 'i' } },
                { job: { $regex: term, $options: 'i' } },
                { technologies: { $elemMatch: { name: { $regex: term, $options: 'i' } } } },
            ];
        }

        const results = await Freelance.find(filter).populate('user');
        return results;
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.createFreelance = async (req, res) => {
    try {
        const freelance = await Freelance.create({ user: req.payload._id, ...req.body });
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

exports.getFreelanceById = async (req, res) => {
    try {
        const freelance = await Freelance.findById(req.params.id).populate('user');
        res.status(200).send({ success: true, freelance });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}




