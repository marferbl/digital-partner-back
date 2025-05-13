const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const vacancyCandidatesSchema = new Schema({
    vacancy: {
        type: Schema.Types.ObjectId,
        ref: "Vacancy",
    },
    discardedCandidates: [{
        type: Schema.Types.ObjectId,
        ref: "Freelance"
    }],
    selectedCandidates: [{
        type: Schema.Types.ObjectId,
        ref: "Freelance"
    }],

}, { timestamps: true });


module.exports = model("VacancyCandidates", vacancyCandidatesSchema);
