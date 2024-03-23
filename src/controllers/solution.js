const Corporate = require('../models/corporate');
const User = require('../models/user');
const Solution = require('../models/solution');

exports.getSolutionsByCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        const solutions = await Solution.find({ corporate });
        res.status(200).send({ success: true, solutions });
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
};

exports.createSolution = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        const solution = await Solution.create({ corporate, ...req.body });
        res.status(200).send({ success: true, solution });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getSolutionById = async (req, res) => {
    try {
        const solution = await
            Solution.findOne({ _id: req.params.id });
        res.status(200).send({ success: true, solution });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getAllSolutionsFilter = async (req, res) => {
    try {
        const term = req.query.term;
        const feature = req.query.feature;
        const isVertical = req.query.isVertical;
        const sector = req.query.sector;
        const languages = req.query.languages;
        const countries = req.query.countries;

        let filter = {};

        if (term) {
            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
                { feature: { $regex: term, $options: 'i' } },
            ];
        }

        if (feature) {
            filter.feature = feature;
        }

        if (isVertical !== undefined) {
            filter.isVertical = isVertical;
        }

        if (sector) {
            filter.sectorType = sector;
        }

        if (languages) {
            filter.languages = { $in: [languages] }; // Wrap the string in an array to use $in
        }

        if (countries) {
            filter.countries = { $in: [countries] }; // Wrap the string in an array to use $in
        }

        const solutions = await Solution.find({ ...filter });
        return solutions;

        // res.status(200).send({ success: true, solutions });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong', error });
    }
};



