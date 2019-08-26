/*
  Superplayer Project
  (c) 2019 Alexandre Mulatinho
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
  let task = sequelize.define("task", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: true },
    due_date: { type: DataTypes.DATE, defaltValue: Date.now() },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    underscored: true
  });

  task.associate = function(models) {
    task.belongsTo(models.project, { onDelete: 'cascade', foreignKey: { name: 'project_id', allowNull: false } });
  }

  return task;
}
