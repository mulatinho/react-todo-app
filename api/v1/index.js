/*
  Superplayer Project 
    (c) 2019 Alexandre Mulatinho
*/

require('./common.js')

exports.connect = function(router, sequelize) {
  var sessions = require('./sessions');
  var projects = require('./projects');
  var tasks    = require('./tasks');

  // sessions
  router.post('/sessions/login', sessions.login);
  router.post('/sessions/signup', sessions.signup);
  router.get('/sessions/logout', sessions.destroy);

  // projects
  router.get('/projects', projects.get);
  router.post('/projects', projects.create);
  router.get('/projects/:id', projects.get);
  router.put('/projects/:id', projects.update);
  router.delete('/projects/:id', projects.destroy);

  // tasks
  router.get('/tasks', tasks.get);
  router.get('/tasks/:id', tasks.get);
  router.put('/tasks/:id', tasks.update);
  router.delete('/tasks/:id', tasks.destroy);
  router.post('/tasks', tasks.create);

  return router;
}
