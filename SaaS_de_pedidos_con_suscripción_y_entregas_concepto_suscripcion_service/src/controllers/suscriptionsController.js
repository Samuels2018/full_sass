'use strict'
const {suscribePlanService, existingSubscription, updatePlanService} = require('../services/suscriptionsService')
const {getPlansById, createPlan} = require('../services/planService')
const {calculateNextBillingDate} = require('../helpers/calculateNextBilling')
const { v4 } =  require('uuid')

async function suscribePlanController (req, res) {
  console.log(req.body)

  const {userId, planId, status, startDate, endDate, planData} = req.body

  console.log('userId', userId)

  if (!planId) {
    return res.status(400).json({error: 'Plan ID is required'})
  }

  try {
    let plan;
    
    // Verificar si el plan existe
    if (planId) {
      plan = await getPlansById(planId);
    }
    console.log('get plan by id')
    console.log(plan.id)

    if (!plan && planData) {
      // Validar los datos mínimos requeridos para crear un plan
      if (!planData.name || !planData.description || !planData.price || !planData.billingCycle) {
        return res.status(400).json({ 
          error: 'Missing required plan data (name, description, price, billingCycle)' 
        });
      }

      // Crear el nuevo plan
      plan = await createPlan({
        name: planData.name,
        description: planData.description,
        price: planData.price,
        billingCycle: planData.billingCycle,
        features: planData.features || [],
        isActive: planData.isActive !== false // default true
      });
      console.log('plans')
      console.log(plan)
      
      if (!plan) {
        return res.status(500).json({ error: 'Error creating new plan' });
      }
      
    } else if (!plan) {
      return res.status(404).json({ error: 'Plan not found and no data provided to create one' });
    }


    const existentSubscription = await existingSubscription(userId)
    if (existentSubscription) {
      return res.status(400).json({error: 'User already has an active subscription'})
    }

    console.log('existentSubscription')
    console.log(existentSubscription)

    const _startDate = startDate || new Date()
    const _endDate = endDate || null
    const nextBillingDate = calculateNextBillingDate(startDate, plan.billingCycle)
    console.log('nextBillingDate')
    console.log(nextBillingDate)

    const { newSubscription }  = await suscribePlanService(userId, plan.id, status, _startDate, _endDate, nextBillingDate)
    if (!newSubscription) {
      return res.status(500).json({error: 'Error creating subscription'})
    }

    res.status(201).json({
      message: 'Subscription created successfully',
      suscription: {
        ...newSubscription,
        plan: plan
      }
    })


  } catch (err) {
    console.log(err)
    return res.status(500).json({error: 'Internal server error'})
  }

}

async function getActiveSubscriptionController (req, res) {
  console.log(req.body)
  const {userId} = req.body

  if (!userId) {
    return res.status(400).json({error: 'User ID is required'})
  }

  try {
    const subscription = await existingSubscription(userId)
    if (!subscription) {
      return res.status(404).json({error: 'No active subscription found for this user'})
    }

    const plan = await getPlansById(subscription.planId)

    if (!plan) {
      return res.status(404).json({error: 'Plan not found'})
    }

    const response = {
      hasSubscription: true,
      subscription: {
        ...subscription.toJSON(),
        plan: plan
      },
      billingInfo: {
        nextBillingDate: subscription.nextBillingDate,
        billingCycle: plan.billingCycle,
        daysUntilRenewal: Math.ceil(
          (new Date(subscription.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      }
    }

    res.status(200).json(response)

  } catch (err) {
    console.log(err)
    return res.status(500).json({error: 'Internal server error'})
  }
}

async function changeSubscriptionController (req, res) {
  console.log(req.body)
  let {userId, planId, status, startDate, endDate, nextBillingDate} = req.body

  if (!userId) {
    return res.status(400).json({error: 'User ID is required'})
  }

  if (!planId) {
    return res.status(400).json({error: 'Plan ID is required'})
  }

  try {

    const plan = await getPlansById(planId)
    if (!plan) {
      return res.status(404).json({error: 'Plan not found'})
    }

    const existentSubscription = await existingSubscription(userId)
    if (!existentSubscription) {
      return res.status(400).json({error: 'User does not have an active subscription'})
    }

    startDate = (startDate === existentSubscription.startDate) ? existentSubscription.startDate : startDate;
    endDate = (endDate === existentSubscription.endDate) ? existentSubscription.endDate : endDate;
    nextBillingDate = (nextBillingDate === existentSubscription.nextBillingDate) ? existentSubscription.nextBillingDate : nextBillingDate;
    status = (status === existentSubscription.status) ? existentSubscription.status : status;

    const updatedSubscription = await updatePlanService(userId, planId, status, startDate, endDate, nextBillingDate)
    console.log('llegando a updatePlanService')
    if (!updatedSubscription) {
      return res.status(500).json({error: 'Error updating subscription'})
    }

    res.status(200).json({
      message: 'Subscription updated successfully',
      subscription: {
        updatedSubscription,
        plan: plan
      }
    })

  }catch (err) {
    console.log(err)
    return res.status(500).json({error: 'Internal server error'})
  }
}

module.exports = {
  suscribePlanController,
  getActiveSubscriptionController,
  changeSubscriptionController
}