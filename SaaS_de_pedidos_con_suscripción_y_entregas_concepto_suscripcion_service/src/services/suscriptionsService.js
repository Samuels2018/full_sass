'use strict'

require('dotenv').config();
const {Subscriptions}  = require('../../models')

const suscribePlanService = async (userId, planId, status, startDate, endDate, nextBillingDate) => {

  const defaultData = {
    userId: String(userId),
    planId: planId || 1,
    status: status || 'active',
    startDate: startDate || new Date(),
    endDate: endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
    nextBillingDate: nextBillingDate || new Date(new Date().setMonth(new Date().getMonth() + 1))
  }

  console.log(defaultData)

  const subscription = await Subscriptions.create(
    defaultData,
    {
    hooks: false,
    logging: console.log
  });

  console.log(subscription)

  return {subscription}
}

const existingSubscription = async (userId) => {
  const suscription  = await Subscriptions.findOne({
    where: {
      userId: userId
    }
  })

  return suscription
}

const updatePlanService = async (userId, planId, status, startDate, endDate, nextBillingDate) => {
  const updatedSubscription = await Subscriptions.update({
    planId: planId,
    status: status,
    startDate: startDate,
    endDate: endDate,
    nextBillingDate: nextBillingDate
  }, {
    where: {
      userId: String(userId)
    }
  })

  return updatedSubscription
}


module.exports = {
  suscribePlanService,
  existingSubscription,
  updatePlanService
}