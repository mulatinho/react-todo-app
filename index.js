/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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
  app.use('/v1', router1);

  return router1;
}

//
// Setup stack
//

function configure(app) {
  app.use(bodyParser.json());
  app.use(cors());
  app.disable('x-powered-by');
  app.set('view engine', 'html');
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
      console.log('Backend listening on port ' + port);
    });
  }
});

// render 404 view if user browse something unexpected.
app.use(function(req, res) { res.status(404).json({}); });

// handle errors and print stacktrace
app.use(function(error, request, response, next) {
  console.log('logging events and showing stacktrace..');
  console.log('message: ' + error.message + '\nerror: ' + error);
  if ('production' == app.get('env') || 'production' == process.env.NODE_ENV) {
    response.status(error.status || 500).json({ 'message': error.message, 'error': error });
  } else {
    response.status(500).json({});
  }
});

module.exports = app;
