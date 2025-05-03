const express = require('express')
const { signUp, login, verifyOtp, fetchProfile } = require('../controllers/authControllers')
const router = express.Router()
router.post("/signup",signUp)
router.post("/login",login)
router.post("/verifyotp",verifyOtp)
router.get("/fetchprofile",fetchProfile)


module.exports = router