const User = require('../db/models/user');
const { Workspace } = require('../db/models/workspace');

module.exports.getWorkspacesByGithubId = (id) => {
   return User.findOne({ 'github.id': id }).then((user) => {
      return Promise.all(user.workspaces.map((ws) => {
         return Workspace.findById(ws).then((wsRecord) => {
            return { name: wsRecord.name, _id: wsRecord._id };
         });
      }))
   }, (e) => {
      return e;
   });
};

module.exports.saveWorkspace = (workspace) => {
   workspace.save().then((doc) => {
      // Add workspace to user profile
      User.findOne({ 'github.id': req.user.github.id }).then((user) => {
         user.workspaces.push(doc._id);
         user.save().then((updatedUser) => {
            res.send(updatedUser);
         }, (e) => {
            res.status(404).send(e)
         });
      }, (e) => {
         res.status(404).send(e);
      });
      res.send(doc._id);
   }, (e) => {
      res.status(400).send(e);
   });
};
  