/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

require('./common.js')

exports.connect = function(router, sequelize) {
  var projects = require('./projects');
  var tasks    = require('./tasks');

  // projects
  router.get('/projects', projects.get);
  router.get('/projects/:id', projects.get);
  router.put('/projects/:id', projects.update);
  router.delete('/projects/:id', projects.destroy);
  router.post('/projects', projects.create);

  // tasks
  router.get('/tasks', tasks.get);
  router.get('/tasks/:id', tasks.get);
  router.put('/tasks/:id', tasks.update);
  router.delete('/tasks/:id', tasks.destroy);
  router.post('/tasks', tasks.create);

  return router;
}
