const app = require('../server').app;
const supertest = require('supertest');
const request = supertest(app);
const agent = supertest.agent(app);
const expect = require('expect');
const getWorkspacesByGithubId = require('../utils/utils').getWorkspacesByGithubId;

const createAuthenticatedUser = (done) => {
   agent
      .get('/auth/github/callback')
      .expect(200)
      .end((error, res) => {
         done();
      });
}

describe('Server', () => {
   it('authenticate', createAuthenticatedUser);
   it('should fail fetching non-existent workspace', (done) => {
      agent
         .get('/workspace/224242')
         .expect(404)
         .expect((res) => {
            expect(res.body.error).toBe('Workspace not found');
         })
         .end(done);
   });
   it('should get Nadir\'s sample workspace', (done) => {
      agent
         .get('/workspace/5b981da10995c7517a615d58')
         .expect(200)
         .expect((res) => {
         })
         .end(done);
   });

});