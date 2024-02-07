const Corporate = require('../models/corporate');
const User = require('../models/user');
const Solution = require('../models/solution');

exports.getSolutionsByCorporate = async (req, res) => {
    try {
        const corporate = req.params.id;
        const solutions = await Solution.find({ corporate });
        return { success: true, solutions };
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
        return { success: true, solution };
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}