const expect = require('expect');
const utils = require('../utils/utils');
const Workspace = require('../db/models/workspace');
const ts = require('unix-timestamp');

describe('Utils', () => {
   it('should get workspaces by user id', (done) => {
      utils.getWorkspacesByGithubId('14299057').then((workspaces) => {
         expect(workspaces.length).toBeGreaterThan(0);
      }).then(done, done);
   });

   it('should save the workspace', (done) => {
      let githubId = '14299057';
      
      let workspace = new Workspace({
         name: 'TestWorkspace',
         description: 'This is a test workspace',
         filename: 'index.js',
         createdAt: ts.now(),
         createdBy: githubId
      });

      utils.saveWorkspace(workspace, githubId).then((workspace) => {
         expect(workspace.name).toBe('TestWorkspace');
      }).then(done, done);
   })
});