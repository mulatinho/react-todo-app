/*
  Superplayer Project 
    (c) 2019 Alexandre Mulatinho
*/

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sequelize = require('sequelize');
const config = require(__dirname + '/config/config.js');
const fs = require('fs');

process.env.TZ = "America/Sao_Paulo"
global.db      = require(__dirname + '/models');

//
// Connect API methods
//

function routeApi(app, sequelize) {
  let router1 = express.Router();
  let v1 = require('./api/v1');

  v1.connect(router1, sequelize);
  app.use('/', router1);

  return router1;
}

//
// Setup stack
//

function configure(app) {
  // useful hack for get request seconds
  app.use(function(req, res, next) { req.start = new Date(); next(); });
  app.use(expressSession({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 86400 }}));
  app.use(bodyParser.urlencoded({ limit: '3mb', extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.disable('x-powered-by');
  // creating datadirectory if not exists
  const datadir = __dirname + '/data';
  if (!fs.existsSync(datadir)) { fs.mkdir(datadir, () => {}); }
}

//
// Entry point for the application
//

let app = express();

configure(app);
routeApi(app, sequelize);

// synchronize data, remaking the tables if neeeded.
db.sequelize.sync({}).then(function () {
  const port = config.web.port;

  if (!module.parent) {
    app.listen(port, function() {
      console.log('Listen on Port ' + port);
    });
  }
});

// render 404 view if user browse something unexpected.
app.use(function(req, res) { res.status(404).render('404'); });

if ('production' == app.get('env') || 'production' == process.env.NODE_ENV) {
  // production error handler, no stacktraces leaked to user
  app.use(function(error, request, response, next) {
    console.log('logging events and showing stacktrace only local..')
    console.log('errorStatus: ', error.status, 'errorMessage: ', error.message);
    response.status(500).json({});
  })
} else {
  // handle errors and print stacktrace
  app.use(function(error, request, response, next) {
    console.log('logging events and showing stacktrace..');
    console.log('message: ' + error.message + '\nerror: ' + error);
    response.status(error.status || 500).json({ 'message': error.message, 'error': error });
  })
}

module.exports = app;
