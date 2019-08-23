/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, defaultValue: "Anonymous" },
    avatar_url: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    session_token: { type: DataTypes.TEXT, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    underscored: true
  });

  return user;
}
