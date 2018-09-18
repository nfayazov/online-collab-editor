const path = require('path').join(__dirname, '../../public/');
const ts = require('unix-timestamp');
const Workspace = require('../db/models/workspace');
const {Commit} = require('../db/models/commit');
const utils = require('../utils/utils');
const ObjectId = require('mongoose').Schema.Types.ObjectId;

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
         var dev = false;
         if (process.env.NODE_ENV === 'development') dev = true;
         res.render(path + 'views/login.hbs', {dev : dev});
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

   app.route('/auth/mock')
      .get(passport.authenticate('github', {mock: true}), (req, res) => {
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
            createdBy: req.user.github.id,
         });
         utils.saveWorkspace(workspace, req.user.github.id).then((workspace) => {
            let initCommit = new Commit({
               workspace: workspace._id,
               text: '',
               createdAt: ts.now(),
               createdBy: req.user.github.id
            });
            workspace.commits.push(initCommit);
            workspace.save().then(workspace => {
               initCommit.save().then(_ => {
                  res.send(workspace._id);
               });
            });
         }).catch(e => {
            res.status(404).send(e);
         });
      })
      .get(isLoggedIn, function(req, res) {
         res.sendFile(path + 'newWorkspace.html');
      });
      
   /* TODO: check and make sure that user is collaborator of workspace */
   app.route('/workspace/:id')
      .get(isLoggedIn, (req, res) => {
         Workspace.findById(req.params.id).then((ws) => {
            let lastCommit = ws.commits[ws.commits.length-1];
            Commit.findById(lastCommit).then((commit) =>{
               res.render(path + 'views/workspace.hbs', { filename: ws.filename, text: commit.text });
            });
         }).catch(e => {
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
         utils.inviteUser(req.user.github.id, req.params.workspaceId, req.params.username).then((invitee) => {
            res.render(path + 'views/invite-success.hbs', {invitee: invitee.github.username});
         }, e => res.status(404).send(e));
      });

   app.route('/api/commit/')
      .post(isLoggedIn, (req, res) => {
         let commit = new Commit({
            workspace: req.body.workspace,
            text: req.body.text,
            createdAt: ts.now(),
            createdBy: req.user.github.id
         });

         commit.save().then((commit) => {
            Workspace.findById(req.body.workspace).then((workspace) => {
               workspace.commits.push(commit._id);
               workspace.save();
            }).then((_) => res.send(commit.text));
         }).catch(e => console.log(e));
      });

   // POST /workspace/:id 
   // {text:"func main()",
   // users: "user1", "user3", "user5"
   // id: "_autogeneratedId",
   // commitedAt: 424245454543,
   // commitedBy: "user1"}

   // UPDATE /workspace/autegeneratedId 
}