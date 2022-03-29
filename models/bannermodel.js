const mongoose = require('mongoose')
const bannerSchema = mongoose.Schema({
    picture:{
        type:String,
        require:true
    }
},{timestamps: true})

const banner = mongoose.model('banner',bannerSchema)
module.exports = banner
