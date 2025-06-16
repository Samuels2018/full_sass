'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Plans extends Model {
    static associate(models) {
      // define association here
      Plans.hasMany(models.Subscriptions, {
        foreignKey: 'planId',
        as: 'subscriptions',
      })
    }
  }
  Plans.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    billingCycle: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['monthly', 'annual', 'quarterly']]
      }
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Plans',
    tableName: 'plans',
    underscored: true,
    timestamps: true,
  })
  return Plans
}