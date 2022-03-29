
const mongoose = require('mongoose')
const bookingSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true
        
    },

    phone:{
        type:String,
        require:true
    },

    city:{
        type:String,
        require:true
    },

    date:{
        type:String,
        require:true
    },
    
    message:{
        type:String,
        require:true
    },
    
    bookedBy:{
        type:String,
        require:true
    },
    bookbyemail:{
        type:String,
        require:true
    }

},{timestamps: true})

const booking = mongoose.model('booking',bookingSchema)
module.exports = booking
