/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

exports.get = function(request, response) {
  const task_id = request.params.id || null;
  const project_id = request.query.project_id || null;
  let page      = request.query.page || 0;
  let search    = request.query.search || '';
  let orderBy   = request.query.order || 'ASC';
  let offset    = page * 20;

  if (task_id != null) {
    db.task.findOne({
      where: { id: task_id }
    }).then(taskFound => {
      if (!taskFound) { return response.json({}); }

      response.json({ task: taskFound, page: page })
    }).catch(error => { console.log(error) });
  } else {

    db.task.findAll({
      where: { project_id: project_id },
      limit: 20,
      offset: offset,
      order: [ [ 'due_date', orderBy ] ]
    }).then(taskList => {
      return response.json({ taskList: taskList, page: page })
    }).catch(error => { console.log(error) });
  }
}

exports.create = function(request, response) {
  const inputData = [ "description", "project_id", "owner", "due_date", "status" ]
  let data = {}
  if (!validBodyInput(request, data, inputData, ["description"])) { return response.status(400).json({}) }

  console.log(request.body)

  db.task.findOrCreate({
    where: {
      description: data.description,
      project_id: data.project_id
    }
  }).spread((taskNew, isNew) => {
    if (isNew) {
      taskNew.owner = data.owner;
      taskNew.due_date = data.due_date;
      taskNew.status = checkStatus(data.due_date);

      taskNew.save().then(() => {});
    }

    return response.json({})
  }).catch(error => { console.log(error) });
}

exports.update = function(request, response) {
  const task_id = request.params.id || null;
  const inputData = [ "description", "owner", "due_date", "status" ]
  let data = {}

  if (!validBodyInput(request, data, inputData, ["description"])) { return response.status(400).json({}) }

  db.task.findOne({
    where: {
      id: task_id
    }
  }).then((taskFound) => {
    if (!taskFound) { return response.status(404).json({}); }

    taskFound.description = data.description;
    taskFound.owner = data.owner;
    taskFound.due_date = new Date(data.due_date);
    taskFound.status = parseInt(data.status) == 2 ? 2 : checkStatus(data.due_date);

    taskFound.save().then(() => {});

    return response.json(taskFound)
  }).catch(error => { console.log(error) });
}

exports.destroy = function(request, response) {
  const task_id = request.params.id || null;

  db.task.findOne({
    where: { id: task_id }
  }).spread((taskFound, isNew) => {
    if (!taskFound) { return response.status(404).json({}); }

    taskFound.destroy().then(() => {});

    return response.json({})
  }).catch(error => { console.log(error) });
}
