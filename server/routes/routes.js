const path = require('path').join(__dirname, '../../public/');
const ts = require('unix-timestamp');
const { Workspace } = require('../db/models/workspace');
const User = require('../db/models/user');
const utils = require('../utils/utils');

module.exports = function(app, passport) {

   function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	};

   app.route('/')
      .get(isLoggedIn, function (req, res) {
         res.redirect('/profile');
      });

   app.route('/login')
      .get((req, res) => {
         res.render(path + 'views/login.hbs');
	   });

   app.route('/workspace-test')
      .get(isLoggedIn, function (req, res) {
         res.render(path + 'views/workspace.hbs', { filename: 'test.js' });
      });
      
   app.route('/profile')
      .get(isLoggedIn, function (req, res) {
         let profile = {
            name: req.user.github.displayName,
            username: req.user.github.username,
            avatar_url: req.user.github.avatar_url,
            bio: req.user.github.bio
         };
         utils.getWorkspacesByGithubId(req.user.github.id).then((workspaces) => {
            profile.workspaces = workspaces;
            res.render(path + 'views/profile.hbs', profile);
         }, (e) => {
               res.status(404).send(e);
         });
      });

   app.route('/auth/github')   
      .get(passport.authenticate('github'), (req, res) => {
         if (process.env.NODE_ENV === 'development')
            res.redirect('/profile');
      });

   app.route('/auth/github/callback')
      .get(passport.authenticate('github', { failureRedirect: '/login' } ),
         function(req, res) {
            res.redirect('/profile');
      });

   app.route('/api/:id')
      .get(isLoggedIn, function(req,res) {
         res.json(req.user.github);
      });

   app.route('/new')
      .post(isLoggedIn, function(req,res) {
         let workspace = new Workspace({
            name: req.body.name,
            description: req.body.description,
            filename: req.body.filename,
            createdAt: ts.now(),
            createdBy: req.user.github.id
         });
         utils.saveWorkspace(workspace, req.user.github.id).then((workspace) => {
            res.send(workspace._id);
         }, (e) => {
            res.status(404).send(e);
         });
      })
      .get(isLoggedIn, function(req, res) {
         res.sendFile(path + 'newWorkspace.html');
      });
      
   app.route('/workspace/:id')
      .get(isLoggedIn, (req, res) => {
         Workspace.findById(req.params.id).then((ws) => {
            res.render(path + 'views/workspace.hbs', { filename: ws.filename });
         }, (e) => {
            res.status(404).send({error: 'Workspace not found'});
         });
      });  

   app.route('/invite/:workspaceId')
      .get(isLoggedIn, (req, res) => {
         res.render(path + 'views/invite.hbs');
      });

   app.route('/invite/:workspaceId/:username')
      .get(isLoggedIn, (req, res) => {
         // TODO: vuln: only allow owner of the repo to invite users
         console.log(req.params.username);
         utils.inviteUser(req.user.github.id, req.params.workspaceId, req.params.username).then((invitee) => {
            console.log(invitee);
         });
      })

   // POST /workspace/:id 
   // {text:"func main()",
   // users: "user1", "user3", "user5"
   // id: "_autogeneratedId",
   // commitedAt: 424245454543,
   // commitedBy: "user1"}

   // UPDATE /workspace/autegeneratedId 
}