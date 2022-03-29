const mongoose = require('mongoose')
const commentSchema = mongoose.Schema({
    _id:{
        type:Object,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    comment:{
        type:String,
        require:true
    },
    star:{
        type:Array,
        default:5
    },
    profile:{
        type:String,
        require:true
    }
},{timestamps: true})

const comment = mongoose.model('comment',commentSchema)
module.exports = comment












