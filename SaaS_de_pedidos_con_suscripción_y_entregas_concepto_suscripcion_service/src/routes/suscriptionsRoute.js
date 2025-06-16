'use strict'

const {Router} = require('express')
const subscriptions = Router()
const {
  suscribePlanController, 
  getActiveSubscriptionController, 
  changeSubscriptionController
} = require('../controllers/suscriptionsController')
const {authMiddleware} = require('../middlewares/authMiddleware')

// suscribirse a un plan
subscriptions.post('/subscribe', authMiddleware, suscribePlanController)
// obtener suscripcion activa
subscriptions.get('/subscription', authMiddleware, getActiveSubscriptionController)
// cambiar de suscripcion
subscriptions.put('/subscription', authMiddleware, changeSubscriptionController)


module.exports = subscriptions

