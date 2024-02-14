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


});

module.exports = model("Freelance", freelanceSchema);
