require('./config/config');

const express = require('express')
      path = require('path'),
      bodyParser = require('body-parser'),
      routes = require('./routes/routes'),
      session = require('express-session'),
      passport = require('passport'),
      hbs = require('hbs'),
      socket = require('./socket.io');

require('dotenv').load();

let app = express();

// This simply allows us to do localhost:3000/login.html
app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// Templating engine
app.set('view engine', 'hbs');

// Database

let {mongoose} = require('./db/mongoose');

// Authentication

require('./auth/passport')(passport);
let sessionMiddleware = session({
   secret: 'superSecret',
   resave: false,
   saveUninitialized: true
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
      extended: true
}));

routes(app, passport);

// Socket.io

let server = socket(app, sessionMiddleware);

const port = process.env.PORT || 3000;
server.listen(port);

module.exports = {
   app:app, 
   sessionMiddleware: sessionMiddleware
}