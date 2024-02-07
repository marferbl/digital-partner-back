const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const corporateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cif: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    web: {
        type: String,
        required: false,
    },
    superadmin: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    size: {
        type: Number,
    },
    logo: {
        type: String,
        default:
            "https://icons.veryicon.com/png/o/miscellaneous/enterprise-common-linetype-icons/enterprise-6.png",
    },

});

module.exports = model("Corporate", corporateSchema);
