const mongoose = require('mongoose');

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
   collaborators: {
      type: [{
         type: String
      }]
   }/*,
   commits: [{
      type: mongoose.Schema.Types.ObjectId
   }]*/
});

module.exports = {Workspace};