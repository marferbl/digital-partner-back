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
        default: 'https://www.creativefabrica.com/wp-content/uploads/2018/12/Tools-icon-by-rudezstudio-2-580x386.jpg'
    },
    corporate: {
        type: Schema.Types.ObjectId,
        ref: "Corporate",
    },
    features: {
        type: Array,
        default: []
    },
    specifyFeatures: {
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
