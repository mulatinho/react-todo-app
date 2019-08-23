/*
  Superplayer Project
  (c) 2019 Alexandre Mulatinho
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
  let task = sequelize.define("task", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    due_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    underscored: true
  });

  task.associate = function(models) {
    task.belongsTo(models.user, { onDelete: 'cascade', foreignKey: { name: 'user_id', allowNull: false } });
    task.belongsTo(models.project, { onDelete: 'cascade', foreignKey: { name: 'project_id', allowNull: true } });
  }

  return task;
}
