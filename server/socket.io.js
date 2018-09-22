const http = require('http'),
      socketIO = require('socket.io'),
      Commit = require('./db/models/commit'),
      ts = require('unix-timestamp'),
      User = require('./db/models/user'),
      Workspace = require('./db/models/workspace');

module.exports = function(app, sessionMiddleware) {
   let server = http.createServer(app);
   let io = socketIO(server).use(function(socket, next) {
      sessionMiddleware(socket.request, {}, next);
   });

   let users = [];

   io.on('connection', (socket) => {

      socket.on('join', (params, callback) => {
         socket.join(params.workspaceId);
         users.push(params.username);
         console.log(`Joined room: ${users}`);
         io.to(params.workspaceId).emit('user_joined', users);
         //var roster = io.sockets.adapter.rooms[workspaceId].sockets;
         //console.log(roster);
         
         socket.on('commitChanges', (params, callback) => {
            io.to(params.workspaceId).emit('updateCode', {
               text: params.text
            });
            callback();
         });
         callback();
      });
   });

   return server;

}