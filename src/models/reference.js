const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const answerSchema = new Schema({
    order: { type: Number, required: true },
    answer: { type: Number, required: true }
});

const entitySchema = new Schema({
    model: { type: String, required: true }, // Store the model name (Solution or Service)
    itemId: { type: Schema.Types.ObjectId, required: true } // Store the document ID
});

const referenceSchema = new Schema({
    entity: {
        type: entitySchema,
        default: null
    },
    answers: {
        type: [answerSchema],
        default: []
    },
    email: { type: String, required: true },
    companyName: {
        type: String,
        default: null
    },
    contactName: {
        type: String,
        default: null
    },
    job: {
        type: String,
        default: null
    },
    employees: {
        type: Object,
        default: { from: null, to: null }
    },
    timeUsing: {
        type: Object,
        default: { from: null, to: null }
    },
    corporateId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    finished: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

module.exports = model("Reference", referenceSchema);
