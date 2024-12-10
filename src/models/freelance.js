const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const StudySchema = new mongoose.Schema({
  name: { type: String, required: true },
  entity: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: false },
  description: { type: String, required: false },
});

const TechnologySchema = new mongoose.Schema({
  name: { type: String, required: true },
  personal: { type: Boolean, default: false },
  profesional: { type: Boolean, required: false },
  certification: { type: Boolean, required: false },
});

const freelanceSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    unique: true,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  introducction: {
    type: String,
    default: ''
  },
  studies: {
    type: [StudySchema],
    default: [],
  },
  technologies: {
    type: [TechnologySchema],
    default: [],
  },
  aboutMe: {
    type: String,
    default: ''
  },
  web: {
    type: String,
    default: '',
  },
  telephone: {
    type: String,
    default: '',
  },
  skills: {
    type: Array,
    default: [],
  },
  languages: {
    type: Array,
    default: [],
  },
  prefferedWork: {
    type: Array,
    default: [],
  },
  openPrefferedWork: {
    type: Boolean,
    default: false,
  },
  salary: {
    type: Number,
    default: 0,
  },
  openSalary: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

module.exports = model("Freelance", freelanceSchema);
