const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const entitySchema = new Schema({
    model: { type: String, required: true }, // Store the model name (Solution or Service)
    itemId: { type: Schema.Types.ObjectId, required: true } // Store the document ID
});

const favoriteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entities: {
        type: [entitySchema],
        default: []
    }
},
    { timestamps: true }
);

module.exports = model("Favorite", favoriteSchema);
