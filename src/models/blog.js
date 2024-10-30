const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
   template: {
      type: String,
      enum: ['template1', 'template2'],
      required: true
   },
   title: {
      type: String,
      required: true
   },
   subtitle: {
      type: String,
      required: true
   },
   textSections: {
      type: [String],
      validate: {
         validator: (array) => array.length <= 5,
         message: 'You can have up to 5 text sections only'
      },
      default: ["", "", "", "", ""]
   },
   subtitlesSections: {
      type: [String],
      validate: {
         validator: (array) => array.length <= 5,
         message: 'You can have up to 5 subtitles sections only'
      },
      default: ["", "", "", "", ""]
   },
   imageLinks: {
      type: [String],
      validate: {
         validator: (array) => array.length <= 4,
         message: 'You can have up to 3 image links only'
      },
      default: ["", "", "", ""]
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('Blog', BlogSchema);
