const User = require('../db/models/user');
const { Workspace } = require('../db/models/workspace');

module.exports.getWorkspacesByGithubId = (id) => {
   return User.findOne({ 'github.id': id }).then((user) => {
      return Promise.all(user.workspaces.map((ws) => {
         return Workspace.findById(ws).then((wsRecord) => {
            return { name: wsRecord.name, _id: wsRecord._id };
         });
      }));
   }).catch(e => e);
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

module.exports.inviteUser = (githubId, workspaceId, username) => {
   // get the inviter 
   return User.findOne({ 'github.id': githubId })
      .then((user) =>  {
         // check that they're the owner of workspace
         return Workspace.findById(workspaceId).then((workspace) => {
            console.log(`Created By: ${workspace.createdBy}, inviter: ${user.github.id}`);
            if (workspace.createdBy === user.github.id) {
               // get the invitee
               return User.findOne({'github.username':username}).then((invitee) => {
                  // update workspace
                  invitee.workspaces.push(workspace._id);
                  return invitee.save();
               }).then((invitee) => {
               // update invitee's workspaces
                  workspace.collaborators.push(invitee.github.id);
                  return invitee.save();
               });
            } else {
               return Promise.reject('Only the owner of the workspace can invite users');
            }
         });
      }).catch(e => {
         throw e;
      });
   // Check that this is the admin of the workspaceId;
}

  