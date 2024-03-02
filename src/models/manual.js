const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const manualSchema = new Schema({

  name: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
  solution: {
    type: Schema.Types.ObjectId,
    ref: "Solution",
  }
},
  { timestamps: true }
);

module.exports = model("Manual", manualSchema);
