const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profile:{
        type:String,
        default:null
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps: true})

const user = mongoose.model('user',userSchema)
module.exports = user

