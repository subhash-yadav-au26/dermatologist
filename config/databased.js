const mongoose = require('mongoose')
require('dotenv').config()

exports.mongoDB = ()=>{
    mongoose.connect(process.env.URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    const db = mongoose.connection
    db.on('error',()=>console.log('connection error'))

    db.once('open',()=>console.log('databased successfully connected'))
}