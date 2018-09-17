const mongoose = require('mongoose');
const CommitSchema = require('./commit').CommitSchema;

let Workspace = mongoose.model('Workspace', {
   name: {
      type: String,
      require: true
   },
   filename: { // This will be an array of files
      type: String,
      require: true
   },
   description: {
      type: String,
      require: true
   },
   createdAt: {
      type: Number,
      require: true
   }, 
   createdBy: {
      type: String,
      require: true
   },
   collaborators: [String],
   commits: [CommitSchema]
});

module.exports = Workspace;