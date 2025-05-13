const User = require("../models/user");
const Vacancy = require("../models/vacancy");

exports.getAllVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find().populate("corporateId");
        res.status(200).send({ success: true, vacancies });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}

exports.getVacanciesByCorporateId = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id });
        const corporate = await Corporate.findOne({ superadmin: user.id });
        const vacancies = await Vacancy.find({ corporateId: corporate._id })

        res.status(200).send({ success: true, vacancies });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}
exports.createVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.create({ ...req.body });
        const vacancyCandidates = await VacancyCandidates.create({ vacancy: vacancy._id, discardedCandidates: [], selectedCandidates: [] });
        res.status(200).send({ success: true, vacancy });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}
exports.updateVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true });
        res.status(200).send({ success: true, vacancy });

    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}

exports.deleteVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findOneAndRemove({ _id: req.params.id });
        res.status(200).send({ success: true, vacancy });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}
