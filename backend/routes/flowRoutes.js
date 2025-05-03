const express = require('express')
const { createOrUpdateFlow, getFLow } = require('../controllers/flowControllers')
const router =  express.Router()
router.post("/create",createOrUpdateFlow)
router.post("/fetch",getFLow)
module.exports = router