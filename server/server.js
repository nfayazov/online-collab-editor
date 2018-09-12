const express = require('express')
      http = require('http'),
      path = require('path'),
      socketIO = require('socket.io'),
      bodyParser = require('body-parser'),
      routes = require('./routes/routes'),
      session = require('express-session'),
      passport = require('passport'),
      hbs = require('hbs');

require('dotenv').load();

let app = express();

// This simply allows us to do localhost:3000/login.html
app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/styles', express.static(path.join(__dirname, '../public/styles')));

// Templating engine
app.set('view engine', 'hbs');

// Database

let {mongoose} = require('./db/mongoose');

// Authentication

require('./config/passport')(passport);
app.use(session({
	secret: 'superSecret',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
      extended: true
}));

//let {Workspace} = require('./db/models/workspace');

routes(app, passport);

// Socket.io

let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {

   socket.emit('newUser', );
   socket.on('changedText', handleTextSent);

   socket.on('commitChanges', (data, callback) => {
      console.log(data.text);
      callback();
   });
});

let handleTextSent = (data) => {
   text.text = data.text;
   io.sockets.emit('changedText', data);
}

const port = process.env.PORT || 3000;

server.listen(3000, () => {
   console.log('Live Editor');
});

module.exports.app = app;