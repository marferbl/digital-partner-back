const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  countries: {
    type: [String],
    required: true,
  },
  web: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  partnerType: {
    type: [String],
    required: true,
  },
  solutionId: {
    type: Schema.Types.ObjectId,
    ref: "Solution",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  corporate: {
    type: Schema.Types.ObjectId,
    ref: "Corporate",
  }
},
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
