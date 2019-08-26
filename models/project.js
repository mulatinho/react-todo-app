/*
  Superplayer Project
  (c) 2019 Alexandre Mulatinho
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
  let project = sequelize.define("project", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
  }, {
    underscored: true
  });

  project.associate = function(models) {
    project.hasMany(models.task, { onDelete: 'cascade', foreignKey: { name: 'task_id', allowNull: true } });
  }

  return project;
}
