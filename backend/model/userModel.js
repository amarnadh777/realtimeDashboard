const mongoose = require('mongoose')
const userShema = mongoose.Schema({email:String,password:String,otp:String,otpVerified:{type:Boolean,default:false}})
const userModel = mongoose.model("User",userShema)
module.exports = userModel