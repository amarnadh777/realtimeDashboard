const express = require('express')
const { stopSimulator, startSimulator, fetchHistory } = require('../controllers/dataControllers')
const router =  express.Router()
router.get("/start-simulator",startSimulator)
router.get("/stop-simulator",stopSimulator)
router.get("/fetchHistory",fetchHistory)
module.exports = router