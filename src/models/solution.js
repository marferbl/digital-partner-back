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
    feature: {
        type: Array,
        default: []
    },
    type: {
        enum: ["sector", "multi"],
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



});

module.exports = model("Solution", solutionSchema);
