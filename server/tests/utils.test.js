const expect = require('expect');
const utils = require('../utils/utils');
const Workspace = require('../db/models/workspace');
const Commit = require('../db/models/commit').Commit;
const User = require('../db/models/user');
const ts = require('unix-timestamp');
const ObjectId = require('mongoose').Types.ObjectId;

describe('Utils', () => {
   it('should get workspaces by user id', (done) => {
      utils.getWorkspacesByGithubId('14299057').then((workspaces) => {
         expect(workspaces.length).toBeGreaterThan(0);
      }).then(done, done);
   });

   let githubId = '14299057';
   let workspaceId;
   it('should save the workspace', (done) => {
      
      let workspace = new Workspace({
         name: 'TestWorkspace',
         description: 'This is a test workspace',
         filename: 'index.js',
         createdAt: ts.now(),
         createdBy: githubId
      });

      utils.saveWorkspace(workspace, githubId).then(workspace => {
         workspaceId = workspace._id;
         expect(workspace.name).toBe('TestWorkspace');
      }).then(done, done);
   });

   it('should only allow the owner of the workspace to delete', (done) => {
      utils.deleteWorkspace('randomUser', workspaceId).then(result => {
         // shouldn't get here
      }, (e) => {
         expect(e).toBe('Only the owner of the repo can delete a workspace');
      }).then(done, done);
   });

   it('should commit successfully', (done) => {
      let commit = new Commit({
         workspace: workspaceId,
         text: 'Test commit',
         createdAt: ts.now(),
         createdBy: githubId
      });

      utils.commit(commit, workspaceId).then(commit => {
         Workspace.findById(workspaceId).then(workspace => {
            expect(workspace.commits[workspace.commits.length-1]._id).toEqual(commit._id);
         });
      }).then(done, done);
   })

   it('should delete the workspace and changes should cascade', (done) => {
      utils.deleteWorkspace(githubId, workspaceId).then(result => {
         expect(result.n).toBe(1);

         // Workspace was removed from every collaborator's workspaces list
         User.findOne({'github.id' : githubId}).then(user => {
            expect(user.workspaces.indexOf()).toBe(-1);
         });

         Commit.findOne({workspace: workspaceId}).then()
         .catch(e => expect(e.message)
            .toBe('Cast to ObjectId failed for value "" at path "_id" for model "Commit"')
         );     

      }).then(done, done);
   });

});