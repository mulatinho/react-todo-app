/*
   Superplayer Project 
    (c) 2019 Alexandre Mulatinho
*/

const crypto = require('crypto');

exports.login = function(request, response) {
  const { inputEmail, inputPassword } = request.body;
  let data = {
    email: inputEmail,
    password: inputPassword
  };

  let secretString = `#ProjectApp@v1/${data.email}:${data.password}`;
  const hashpass   = crypto.createHash('md5').update(data.password).digest("hex");
  const hashtoken  = crypto.createHmac('sha256', secretString).update(data.email).digest("hex");

  db.user.findOne({
    session_token: hashtoken
  }).then(userFound => {
    if (!userFound) { return response.status(401).json({}); }

    response.cookie("superid", hashtoken, {maxAge: 60 * 60 * 24 * 7 * 1000});

    return response.json({ session_token: hashtoken });
  }).catch((err) => { console.log(err); return response.status(500).json({}) });
}

exports.signup = function(request, response) {
  const { inputName, inputEmail, inputPassword } = request.body;
  let data = {
    avatar_url: 'https://picsum.photos/200/300?grayscale',
    email: inputEmail,
    name: inputName,
    password: inputPassword
  };

  var secretString = `#ProjectApp@v1/${data.email}:${data.password}`;
  const hashpass   = crypto.createHash('md5').update(data.password).digest("hex");
  const hashtoken  = crypto.createHmac('sha256', secretString).update(data.email).digest("hex");

  db.user.findOrCreate({
    where: { email: inputEmail, password: hashpass }
  }).spread((userFound, isNew) => {
    if (!userFound) { return response.status(401).render('401'); }
    if (!isNew) { return response.status(400).json({ error_message: 'already registered' })}

    userFound.name = data.name || "Anonymous";
    userFound.session_token = hashtoken || null;

    response.cookie("superid", hashtoken, {maxAge: 60 * 60 * 24 * 7 * 1000});

    userFound.save().then(() => {});

    return response.json({ session_token: hashtoken });
  }).catch((err) => { console.log(err); return response.status(500).json({}) })
}

exports.destroy = function(request, response) {
  const superid = request.cookies.superid || null;
  if (superid == null) { return response.status(400).json({error_message: 'you are not logged in'})}

  db.user.findOne({
    where: { session_token: superid }
  }).then(userFound => {
    if (!userFound) { return response.status(404).json({}) }

    userFound.session_token = null
    userFound.save().then(() => {});

    return response,json({});
  }).catch((err) => { console.log(err); return response.status(500).json({}) });
}

exports.authWithGithub = function(request, response) {
  return response.status(501).json({})
}
