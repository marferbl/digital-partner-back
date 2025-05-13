const VacancyCandidates = require("../models/vacancy-candidates");
const Freelance = require("../models/freelance");


exports.getAllVacancyCandidates = async (req, res) => {
    try {
        const vacancyCandidates = await VacancyCandidates.find().populate("vacancy").populate("discardedCandidates").populate("selectedCandidates");
        res.status(200).send({ success: true, vacancyCandidates });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}

exports.getVacancyCandidatesById = async (req, res) => {
    try {
        const vacancyCandidates = await VacancyCandidates.findOne({ _id: req.params.id }).populate("vacancy").populate("discardedCandidates").populate("selectedCandidates");
        res.status(200).send({ success: true, vacancyCandidates });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}

exports.selectCandidate = async (req, res) => {
    try {
        const vacancyCandidates = await VacancyCandidates.findOneAndUpdate({ _id: req.body.id }, { $push: { selectedCandidates: req.body.candidateId } }, { new: true })
        res.status(200).send({ success: true, vacancyCandidates });
    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}

exports.discardCandidate = async (req, res) => {
    try {
        const vacancyDiscarded = await VacancyCandidates.findOneAndUpdate({ _id: req.body.id }, { $push: { discardedCandidates: req.body.candidateId } }, { new: true })
        res.status(200).send({ success: true, vacancyDiscarded });
    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
}
