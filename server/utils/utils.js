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

module.exports.saveWorkspace = (workspace, githubId) => {
   return User.findOne({ 'github.id': githubId }).exec()
      .then((user) => {
         user.workspaces.push(workspace._id)
         return user.save();
      })
      .then( _ => workspace.save())
      .then(workspace => workspace)
      .catch(e => e);
}
  