'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.EWalet);
      User.belongsToMany(models.Product, { through: models.Cart });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username Required"
        },
        notNull: {
          msg: "Username Required"
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email Required"
        },
        notNull: {
          msg: "Email Required"
        },
      }
    },
    password: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password Required"
        },
        notNull: {
          msg: "Password Required"
        },
        min: {
          args: 8,
          msg: "Password minimum 8 characters"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Role Required"
        },
        notNull: {
          msg: "Role Required"
        },
        isIn: {
          args: [['buyer', 'seller']],
          msg: "Must be buyer or seller"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(user => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        })
  return User;
};