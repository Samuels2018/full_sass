'use strict'
const {getAllPlans} = require('../services/planService')

async function getPlansController (req, res) {
  console.log(req.body)

  const {userId} = req.body
  if (!userId) {
    return res.status(400).json({error: 'User ID is required'})
  }
  try {
    const plans = await getAllPlans()
    if (!plans) {
      return res.status(404).json({error: 'Plans not found'})
    }

    res.status(200).json(plans)
  } catch (err) {
    console.log(err)
    return res.status(500).json({error: 'Internal server error'})
  }
}

module.exports = {
  getPlansController
}