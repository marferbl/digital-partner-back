const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const freelanceSchema = new Schema({
  country: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slogan: {
    type: String,
    required: false,
  },
  web: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    default: "perHour",
  },
  coin: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  skills: {
    type: Array,
    default: [],
  },
  languages: {
    type: Array,
    default: [],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  study: {
    type: Object,
    default: {},
  },
  jobType: {
    type: String,
    default: "all",
  },
  onlyRemote: {
    type: Boolean,
    default: true,
  },
  hasSetup: {
    type: Boolean,
    default: false,
  },



}, { timestamps: true });

module.exports = model("Freelance", freelanceSchema);
