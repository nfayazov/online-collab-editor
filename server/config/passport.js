'use strict';

let GitHubStrategy = require('passport-github2').Strategy;
let User = require('../db/models/user');
let configAuth = require('./auth');
let MockStrategy = require('./mock-passport/mock-strategy').Strategy;

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
   });

   let handleStrategy = (token, refreshToken, profile, done) => {
      process.nextTick(function () {
         //TODO: refactor this to User.findOrCreate
         User.findOne({ 'github.id': profile.id }, function (err, user) {
            if (err) {
               return done(err);
            }
            if (user) {
               console.log(`Profile Id: ${profile.id}`);
               return done(null, user);
            } else {
               var newUser = new User();
               newUser.github.id = profile.id;
               newUser.github.username = profile.username;
               newUser.github.displayName = profile.displayName;
               newUser.github.bio = profile._json.bio;
               newUser.github.avatar_url = profile._json.avatar_url;

               newUser.save(function (err) {
                  if (err) {
                     throw err;
                  }
                  return done(null, newUser);
               });
            }
         });
      });
   };

   let strategyForEnvironment = () => {
      let strategy;
      switch (process.env.NODE_ENV) {
         case 'production': 
         strategy = new GitHubStrategy({
            clientID: configAuth.githubAuth.clientID,
            clientSecret: configAuth.githubAuth.clientSecret,
            callbackURL: configAuth.githubAuth.callbackURL
         }, handleStrategy);
            break;
         default:
            strategy = new MockStrategy('github', handleStrategy);
      }
      return strategy;
   };

   passport.use(strategyForEnvironment());
};