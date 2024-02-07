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
    }

});

module.exports = model("Solution", solutionSchema);
