const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
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
  otherSolution: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  corporate: {
    type: Schema.Types.ObjectId,
    ref: "Corporate",
  },
  lineType: {
    type: String,
    default: 'services'
  }
},
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
