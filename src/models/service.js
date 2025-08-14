const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  title: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: false,
  },
  countries: {
    type: [String],
    required: false,
  },
  web: {
    type: String,
    required: false,
  },
  serviceType: {
    type: String,
    required: false,
  },
  partnerType: {
    type: [String],
    required: false,
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
  gallery: {
    type: Array,
    default: []
  },
  lineType: {
    type: String,
    default: 'services'
  },
  logo: {
    type: String,
    default: ''
  },
  lastPayment: {
    type: Date,
    default: null
  },
  hiring: {
    type: String,
    required: false,
  }
},
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
