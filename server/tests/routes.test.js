const app = require('../server').app;
const supertest = require('supertest');
const request = supertest(app);
const agent = supertest.agent(app);
const expect = require('expect');

const createAuthenticatedUser = (done) => {
   agent
      .get('/auth/github/callback')
      .expect(200)
      .end((error, res) => {
         done();
      });
}

describe('Routes', () => {
   it('authenticate', createAuthenticatedUser);
   it('should fail fetching non-existent workspace', (done) => {
      agent
         .get('/workspace/224242')
         .expect(404)
         .expect((res) => {
            expect(res.body.message).toBe('Cast to ObjectId failed for value "224242" at path "_id" for model "Workspace"');
         })
         .end(done);
   });
   it('should get Nadir\'s sample workspace', (done) => {
      agent
         .get('/workspace/5ba43c3b140e8e0f32b35d8e')
         .expect(200)
         .end(done);
   });

});