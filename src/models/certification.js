const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const certificationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    solution: {
        type: Schema.Types.ObjectId,
        ref: "Solution",
    }

});

module.exports = model("Certification", certificationSchema);
