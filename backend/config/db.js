const mongoose = require('mongoose')
const db = async() =>
{ 
    try {
        await mongoose.connect("mongodb+srv://amarnadh65:Amar%409020@cluster0.et3nq.mongodb.net/realtimedashboard?retryWrites=true&w=majority&appName=Cluster0")

        console.log("db connected")
    } catch (error) {
        
        console.log(error)
    }

}
module.exports = db