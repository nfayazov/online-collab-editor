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
   createAt: {
      type: Number,
      require: true
   }, 
   commitedBy: {
      type: String,
      require: true
   }/*,
   commits: [{
      type: mongoose.Schema.Types.ObjectId
   }]*/
});

module.exports = {Workspace};