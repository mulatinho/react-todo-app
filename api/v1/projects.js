/*
  Superplayer Project 
    (c) 2019 Alexandre Mulatinho
*/

exports.get = function(request, response) {
  const project_id = request.params.id || null;
  let page      = request.query.page || 0;
  let search    = request.query.search || '';
  let orderBy   = request.query.order || 'ASC';
  let offset    = page * 20;

  CheckUser(request, function(userNow) {
    if (!userNow) { return response.status(401).render('401'); }

    if (project_id != null) {
      db.project.findOne({
        where: { id: project_id },
        include: [
          { model: db.user, attributes: [ 'id', 'name', 'email', 'avatar_url' ], as: 'user' }
        ]
      }).then(projectFound => {
        if (!projectFound) { return response.render('404'); }

        response.render('projects/index', { user: userNow, project: projectFound, page: page })
      }).catch(error => { console.log(error) });
    } else {
      db.project.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { title: { [db.Sequelize.Op.like]: `%${search}%` } },
            { tags: { [db.Sequelize.Op.like]:  `%${search}%` } }
          ]
        },
        limit: 20,
        offset: offset,
        include: [
          { model: db.user, attributes: [ 'id', 'name', 'email', 'avatar_url' ], as: 'user' }
        ],
        order: [ [ 'createdAt', orderBy ] ]
      }).then(projectList => {
        return response.render('projects/index', { user: userNow, projectList: projectList, page: page })
      }).catch(error => { console.log(error) });
    }

  })
}

exports.create = function(request, response) {
  const inputData = [ "projectTitle", "projectDescription" ]
  let data = {}
  if (!validBodyInput(request, data, inputData, ["projectTitle"])) { return response.status(400).json({}) }

  CheckUser(request, function(userNow) {
    if (!userNow) { return response.status(401).render('401'); }

    db.project.findOrCreate({
      where: { title: data.projectTitle, user_id: userNow.id }
    }).spread((projectNew, isNew) => {
      if (isNew) {
        projectNew.description = data.projectDescription

        projectNew.save().then(() => {});
      }

      return response.json({})
    }).catch(error => { console.log(error) });
  })
}

exports.update = function(request, response) {
  const project_id = request.params.id || null;
  const inputData = [ "projectTitle", "projectDescription" ]
  let data = {}

  if (!validBodyInput(request, data, inputData, ["projectTitle"])) { return response.status(400).json({}) }

  CheckUser(request, function(userNow) {
    if (!userNow) { return response.status(401).render('401'); }

    db.project.findOne({
      where: { id: project_id }
    }).then((projectFound) => {
      if (!projectFound) { return response.status(404).render('404'); }

      projectFound.title       = data.projectTitle
      projectFound.description = data.projectDescription

      projectFound.save().then(() => {});

      return response.json(projectFound)
    }).catch(error => { console.log(error) });
  })
}

exports.destroy = function(request, response) {
  const project_id = request.params.id || null;

  CheckUser(request, function(userNow) {
    if (!userNow) { return response.status(401).render('401'); }

    db.project.findOne({
      where: { id: project_id }
    }).spread((projectFound, isNew) => {
      if (!projectFound) { return response.status(404).render('404'); }

      projectFound.destroy().then(() => {});

      return response.json({})
    }).catch(error => { console.log(error) });
  })
}
