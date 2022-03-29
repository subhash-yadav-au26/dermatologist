const Banner = require('../models/bannermodel');
const { banner_valid } = require('../auth/valid');
const cloudinary = require('cloudinary').v2
const fs = require('fs')
require('dotenv').config

// connect to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

uploadtocloud = async (localpath) => {
    const filepathtocloud = localpath
    data = await cloudinary.uploader.upload(localpath, { public_key: filepathtocloud })
    if (!data) {
        return null
    }
    else {
        return data.url
    }
}

exports.addBanner = async (req, res) => {
    try {
        const { picture } = req.file.originalname

        // checking data validation
        const { error } = banner_valid(picture)
        if (error) {
            return res.json(error.details[0].message)
        }

        // image upload to cloudinary
        let localpath = req.file.path.replace(/\\/g, '/')
        let image = await uploadtocloud(localpath)
        fs.unlinkSync(localpath)
        // doctor data save in  model 
        const bannerData = new Banner({
            picture: image
        })
        try {
            const result = await bannerData.save()
            const { ...data } = result._doc
            res.json(data)
            
        } catch (error) {
            res.json(error)
        }

    } catch (error) {
        res.json(error)
    }
}


// find banner admin
exports.findBanner = async (req, res) => {
    try {
        const data = await Banner.find()
        if (!data) {
            return res.send('not find data')
        }
        res.json(data)
    } catch (error) {
        res.send(error)
    }
}


// delete banner by admin
exports.deleteBanner = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Banner.findByIdAndDelete(id)
        try {
            if (!data) {
                return res.status(400).send('id is invalid')
            }
            res.send(`data is deleted ${data._id}`)

        } catch (error) {
            return res.send('error in client side')
        }
    } catch (error) {
        res.send(error)
    }
}
