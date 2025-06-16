'use strict'
const {Router} = require('express')
const plans = Router()
const {getPlansController} = require('../controllers/plansController')
const {authMiddleware} = require('../middlewares/authMiddleware')

// lista de todos los planes
plans.get('/plans', authMiddleware, getPlansController)

module.exports = plans