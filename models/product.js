'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category);
      Product.belongsToMany(models.User, { through: models.Cart });
    }

    static async notifikasi() {
      let notif = await Product.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        ]
      });
      return `${notif[0].dataValues.total} PRODUCTS`
    }

    get description() {
      return `${this.name}, stock: ${this.stock}, (code: ${this.code})`
    }
  }
  Product.init({
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category Required"
        },
        notNull: {
          msg: "Category Required"
        },
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name product Required"
        },
        notNull: {
          msg: "Name product Required"
        },
      }
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Stock Required"
        },
        notNull: {
          msg: "Stock Required"
        },
      }
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Price Required"
        },
        notNull: {
          msg: "Price Required"
        },
      }
    },
    code: DataTypes.STRING,
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image URL Required"
        },
        notNull: {
          msg: "Image URL Required"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });

  Product.beforeCreate(product => {
    product.code = `00${product.id}-` + new Date().getTime();
  });
  return Product;
};