/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

exports.get = function(request, response) {
  const project_id = request.params.id || null;
  let page      = request.query.page || 0;
  let orderBy   = request.query.order || 'DESC';
  let offset    = page * 20;

  if (project_id != null) {
    db.project.findOne({
      where: { id: project_id },
    }).then(projectFound => {
      if (!projectFound) { return response.json({}); }

      response.json({ project: projectFound, page: page })
    }).catch(error => { console.log(error) });
  } else {
    db.project.findAll({
      limit: 20,
      offset: offset,
      order: [ [ 'title', orderBy ] ],
      include: [
        { model: db.task, as: 'tasks' }
      ]
    }).then(projectList => {
      return response.json({ projects: projectList, page: page })
    }).catch(error => { console.log(error) });
  }
}

exports.create = function(request, response) {
  const inputData = [ "title" ]
  let data = {}
  if (!validBodyInput(request, data, inputData, inputData)) {
    return response.status(400).json({})
  }

  db.project.findOrCreate({
    where: { title: data.title }
  }).spread((projectNew, isNew) => {
    if (isNew) {
      projectNew.save().then(() => {});
    }

    return response.json(projectNew)
  }).catch(error => { console.log(error) });
}

exports.update = function(request, response) {
  const project_id = request.params.id || null;
  const inputData = [ "title" ]
  let data = {}

  if (!validBodyInput(request, data, inputData, inputData)) {
    return response.status(400).json({})
  }

  db.project.findOne({
    where: { id: project_id }
  }).then((projectFound) => {
    if (!projectFound) { return response.status(404).json({}); }

    projectFound.title = data.projectTitle
    projectFound.save().then(() => {});

    return response.json(projectFound)
  }).catch(error => { console.log(error) });
}

exports.destroy = function(request, response) {
  const project_id = request.params.id || null;

  db.project.findOne({
    where: { id: project_id }
  }).then((projectFound) => {
    if (!projectFound) { return response.status(404).json({}); }

    projectFound.destroy().then(() => {});

    return response.json({})
  }).catch(error => { console.log(error) });
}
