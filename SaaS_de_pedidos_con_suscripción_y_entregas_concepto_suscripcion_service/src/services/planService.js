'use strict'

const {Plans} = require('../../models')
const { where } = require('sequelize')

const getPlansById = async (planId) => {
  const plan = await Plans.findOne({
    where: {
      id: planId
    }
  })

  return plan
}

const getAllPlans = async () => {
  const plans = await Plans.findAll({
    where: {
      isActive: true
    }
  })
  return plans
}

const createPlan = async (name, description, price, billingCycle, features, isActive) => {
  const plan = await Plans.create(
    name,
    description,
    price,
    billingCycle,
    features,
    isActive
  )

  return plan
}

module.exports = {
  getPlansById,
  getAllPlans,
  createPlan
}