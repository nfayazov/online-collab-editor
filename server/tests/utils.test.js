const expect = require('expect');
const getWorkspacesByGithubId = require('../utils/utils').getWorkspacesByGithubId;

describe('Utils', () => {
   it('should get workspaces by user id', (done) => {
      getWorkspacesByGithubId('14299057').then((workspaces) => {
         expect(workspaces.length).toBeGreaterThan(0);
      }).then(done, done);
   });
})