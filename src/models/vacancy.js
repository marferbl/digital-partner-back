const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const vacancySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salaryMin: {
        type: Number,
        required: true,
    },
    salaryMax: {
        type: Number,
        required: true,
    },
    country: {
        type: Array,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    jobType: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    },
    languages: {
        type: Array,
        required: false,
    },
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: "Corporate",
    },
    candidates: {
        type: Array,
        
    }

}, { timestamps: true });


module.exports = model("Vacancy", vacancySchema);
