let mongoose = require('mongoose');

let User = new mongoose.Schema({
	github: {
		id: String,
		displayName: String,
      username: String,
      bio: String,
      avatar_url: String
   },
   workspaces: [{
      type: mongoose.Schema.Types.ObjectId,
   }]
});

module.exports = mongoose.model('User', User);