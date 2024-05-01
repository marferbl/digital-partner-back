const Corporate = require('../models/corporate');
const User = require('../models/user');
const Solution = require('../models/solution');
const cloudinary = require("../cloudinary-config");


exports.getSolutionsByCorporate = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        const solutions = await Solution.find({ corporate })
        res.status(200).send({ success: true, solutions });
    } catch (error) {
        res.sendStatus(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
};

exports.updateSolution = async (req, res) => {
    try {
        const solution = await Solution
            .findOneAndUpdate({ _id: req.params.id }, req
                .body, { new: true });
        res.status(200).send({ success: true, solution });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.deleteSolution = async (req, res) => {
    try {
        await Solution.findOneAndDelete({ _id: req.params.id });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

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

exports.uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const solution = await Solution.findByIdAndUpdate(
            req.params.id,
            {
                logo: result.secure_url,
            },
            { new: true }
        );
        res.status(200).json(solution);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}


exports.getSolutionById = async (req, res) => {
    try {
        const solution = await
            Solution.findOne({ _id: req.params.id }).populate({
                path: 'corporate',
                populate: { path: 'superadmin' }
            })
        res.status(200).send({ success: true, solution });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getAllSolutions = async (req, res) => {
    try {
        const solutions = await Solution.find();
        res.status(200).send({ success: true, solutions });
    } catch (error) {
        res.status(500 || 400).send({ message: 'Something went wrong', error });
        return { success: false, error };
    }
}

exports.getAllSolutionsFilter = async (req, res) => {
    try {
        const term = req.query.term;
        const features = req.query.features;
        const isVertical = req.query.isVertical;
        const sector = req.query.sector;
        const languages = req.query.languages;
        const countries = req.query.countries;
        const lineType = req.query.lineType;
        const isErp = req.query.isErp;
        const specifyFeatures = req.query.specifyFeatures;


        let filter = {};

        if (term) {
            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
            ];
        }

        if (lineType) {
            filter.lineType = lineType;
        }

        if (isVertical !== undefined) {
            filter.isVertical = isVertical;
        }

        if (sector) {
            filter.sectorType = sector;
        }

        if (languages) {
            filter.languages = { $in: languages }; // Wrap the string in an array to use $in
        }

        if (countries) {
            filter.countries = { $in: countries }; // Wrap the string in an array to use $in
        }

        if (features) {
            filter.features = { $in: features };
        }

        if (specifyFeatures) {
            filter.specifyFeatures = { $in: specifyFeatures };
        }



        if (isErp !== undefined) {
            if (isErp === 'true') {
                filter.isErp = true;
            }
        }

        const solutions = await Solution.find({ ...filter });
        return solutions;

        // res.status(200).send({ success: true, solutions });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong', error });
    }
};



