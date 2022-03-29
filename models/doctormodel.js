const mongoose = require('mongoose')
const doctorSchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    qualification:{
        type:String,
        require:true
    },
    expirence:{
        type:String,
        require:true
    },
    specialist:{
        type:String,
        require:true
    },
    profile:{
        type:String,
        require:true
    }
},{timestamps: true})

const doctor = mongoose.model('doctor',doctorSchema)
module.exports = doctor
