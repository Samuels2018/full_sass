'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    static associations(models) {
      Subscriptions.belongsTo(models.Plans, {
        foreignKey: 'planId',
        as: 'plan',
      })
    }
  }
  Subscriptions.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'custom_auth_useraccount',
        key: 'id'
      }
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Plans',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['active', 'inactive', 'cancelled']]
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nextBillingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    modelName: 'Subscriptions',
    tableName: 'subscriptions',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
    ]
  })
  return Subscriptions
}