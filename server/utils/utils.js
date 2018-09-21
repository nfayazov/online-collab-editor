const User = require('../db/models/user');
const Workspace = require('../db/models/workspace');
const Commit = require('../db/models/commit').Commit;
const ObjectId = require('mongoose').Types.ObjectId;
const ts = require('unix-timestamp');

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
   let initCommit = new Commit({
      workspace: workspace._id,
      text: '',
      createdAt: ts.now(),
      createdBy: githubId
   });
   
   return User.findOne({ 'github.id': githubId }).exec()
      .then((user) => {
         user.workspaces.push(workspace._id)
         return user.save();
      }).then( _ => workspace.save())
      .then(workspace => {
         // Make init commit
         workspace.commits.push(initCommit);
         return workspace.save();
      }).then(_ => initCommit.save())
      .then(_ => workspace)
      .catch(e => e);
}

module.exports.deleteWorkspace = (githubId, workspaceId) => {
   // Check if owner of repo
   return Workspace.findById(workspaceId).then((workspace) => {
      if (workspace.createdBy === githubId) {
         return workspace;
      } else {
         throw 'Only the owner of the repo can delete a workspace';
      }
   }).then(workspace => {
      // delete all commits
      Commit.deleteMany({'workspace' : workspaceId}).exec().then((_) => {
      }, e => {throw e});

      // delete workspace from all collaborators
      User.updateMany({ workspaces: { $elemMatch: { $eq: new ObjectId(workspaceId) } } }, { $pull: { workspaces: new ObjectId(workspaceId) } } 
         ,function (err) {
            if (err) throw err;
         });
      return Workspace.deleteOne({_id: new ObjectId(workspace._id)});
   }).then(result => {
      return result;
   }).catch(e => { throw e});
}

module.exports.commit = (commit, workspace) => {
   return commit.save().then((commit) => {
      return Workspace.findById(workspace).then((workspace) => {
         workspace.commits.push(commit);
         return workspace.save();
      }, e => { throw e })
      .then((_) => commit);
   }).catch(e => { throw e });
}

module.exports.inviteUser = (githubId, workspaceId, username) => {
   // get the inviter 
   return User.findOne({ 'github.id': githubId })
      .then((user) =>  {
         // check that they're the owner of workspace
         return Workspace.findById(workspaceId).then((workspace) => {
            if (workspace.createdBy === user.github.id) {
               // get the invitee
               return User.findOne({'github.username':username}).then((invitee) => {
                  // update workspace if doesn't exist
                  if (invitee.workspaces.indexOf(workspace._id)<0) {
                     invitee.workspaces.push(workspace._id);
                     return invitee.save();
                  } else {
                     throw `User ${invitee.github.username} is already a collaborator of this project`;
                  }  
               }).then((invitee) => {
               // update invitee's workspaces
                  workspace.collaborators.push(invitee.github.id);
                  return invitee.save();
               }, e => { throw e });
            } else {
               throw 'Only the owner of the workspace can invite users';
            }
         });
      }).catch(e => {
         throw e;
      });
   // Check that this is the admin of the workspaceId;
}

  