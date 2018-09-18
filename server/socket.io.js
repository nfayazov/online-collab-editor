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

   io.on('connection', (socket) => {

      socket.on('commitChanges', (params, callback) => {
         socket.join(params.workspaceId);
         
         console.log(`Joined room: ${params.workspaceId}`);
         io.to(params.workspaceId).emit('updateCode', {
            text: params.text
         });
         callback();
      });
   });

   return server;

}