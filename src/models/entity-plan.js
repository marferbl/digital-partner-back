const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const entityPlanSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    entity: {
        model: { type: String, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true }
    },
    description: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    }
}, { timestamps: true });

module.exports = model("EntityPlan", entityPlanSchema); 