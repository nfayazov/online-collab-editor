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

   let users = {};

   io.on('connection', (socket) => {

      socket.on('join', (params, callback) => {
         socket.join(params.workspaceId);
         users[socket.id] = params.username;
         io.to(params.workspaceId).emit('update_users', Object.keys(users).map(id => users[id]));
         
         socket.on('commitChanges', (params, callback) => {
            io.to(params.workspaceId).emit('updateCode', {
               commitId: params. commitId,
               text: params.text,
               description: params.description
            });
            callback();
         });

         socket.on('disconnect', () => {
            delete users[socket.id];

            socket.broadcast.to(params.workspaceId).emit('update_users', Object.keys(users).map(id => users[id]));
         })

         callback();
      });
   });

   return server;

}