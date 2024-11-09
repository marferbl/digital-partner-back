const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        default: ''
    },
    type: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    corporate: {
        type: Schema.Types.ObjectId,
        ref: "Corporate",
    },
    maximumCapacity: {
        type: Number,
        default: 0
    },
    lineType: {
        type: String,
        default: 'events'
    },
    date: {
        type: Date,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },
    duration: {
        type: Number,
        required: false,
    },
    coordinates: {
        type: Object,
        default: { lat: '', lng: '' }
    },
    gallery: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        default: 0
    },


});

module.exports = model("Event", eventSchema);
