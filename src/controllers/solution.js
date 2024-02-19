const Corporate = require('../models/corporate');
const User = require('../models/user');
const Solution = require('../models/solution');

exports.getSolutionsByCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.payload._id });
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
        const user = await User.findOne({ id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        const solution = await Solution.create({ corporate, ...req.body });
        res.status(200).send({ success: true, solution });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}