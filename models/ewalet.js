'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EWalet extends Model {
    static associate(models) {
      EWalet.belongsTo(models.User);
    }
  }
  EWalet.init({
    UserId: DataTypes.INTEGER,
    saldo: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EWalet',
  });

  EWalet.beforeCreate(ewalet => {
    ewalet.saldo = 1000000;
    ewalet.status = "Active"
  });
  return EWalet;
};