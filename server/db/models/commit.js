const mongoose = require('mongoose');

let CommitSchema = new mongoose.Schema({
   workspace: {
      type: mongoose.Schema.Types.ObjectId, 
      require: true
   }, 
   text: {
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
});

module.exports.CommitSchema = CommitSchema;
module.exports.Commit = mongoose.model('Commit', CommitSchema);
