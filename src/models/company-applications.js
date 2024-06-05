const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const companyApplications = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: "Corporate",
        required: true,
    },
    solutions: {
        type: Boolean,
        default: true,
    },
    services: {
        type: Boolean,
        default: true,
    },
    events: {
        type: Boolean,
        default: true,
    },
    teamManagement: {
        type: Boolean,
        default: false,
    },
    licenses: {
        type: Boolean,
        default: false,
    },
    recruitment: {
        type: Boolean,
        default: false,
    },
});

module.exports = model("CompanyApplications", companyApplications);
