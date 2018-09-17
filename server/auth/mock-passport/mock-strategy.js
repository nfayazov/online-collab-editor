'use strict';

const passport = require('passport-strategy');
const util = require('util');

const user1 = require('./mock-profile');
const user2 = require('./mock-profile2');

function Strategy(name, strategyCallback) {
   if (!name || name.length === 0) { throw new TypeError('DevStrategy requires a Strategy name'); }
   passport.Strategy.call(this);
   this.name = name;
   //this._user = user;
   // Callback supplied to OAuth2 strategies handling verification
   this._cb = strategyCallback;
}

util.inherits(Strategy, passport.Strategy);
Strategy.prototype.authenticate = function (_, options) {
   if (options.mock === true) this._user = user2;
   else this._user = user1;
   this._cb(null, null, this._user, (error, user) => {
      this.success(user);
   });
}
module.exports = {
   Strategy
};