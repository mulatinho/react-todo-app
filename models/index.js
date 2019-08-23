/*
  Superplayer Project
   (c) 2019 Alexandre Mulatinho
*/

'use strict';

const fs       = require('fs');
const path     = require('path');
const basename = path.basename(module.filename);
const env      = process.env.NODE_ENV || 'development';
const config   = require(__dirname + '/../config/config');
let Sequelize  = require('sequelize');
let db         = {};

var sequelize = new Sequelize(config.database.name, null, null, config.database.options);

fs
 .readdirSync(__dirname)
 .filter(function(file) {
   return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
 })
 .forEach(function(file) {
   var model = sequelize['import'](path.join(__dirname, file));
   db[model.name] = model;
 });

Object.keys(db).forEach(function(modelName) {
 if (db[modelName].associate) {
   db[modelName].associate(db);
 }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
