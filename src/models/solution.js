const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const solutionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    logo: {
        type: String,
        required: false,
    },
    corporate: {
        type: Schema.Types.ObjectId,
        ref: "Corporate",
    },
    features: {
        type: Array,
        default: []
    },
    isErp: {
        type: Boolean,
        default: false
    },
    isSectorial: {
        type: Boolean,
        default: false
    },
    sectorType: {
        enum: ["services", "industrial", 'firstSector', ''],
        type: String,
    },
    website: {
        type: String,
        required: false,
    },
    countries: {
        type: Array,
        default: []
    },
    languages: {
        type: Array,
        default: []
    },
    lineType: {
        type: String,
        default: 'solutions'
    }



});

module.exports = model("Solution", solutionSchema);
