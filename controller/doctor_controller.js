const { doctor_valid } = require('../auth/valid')
const Doctor = require('../models/doctormodel')
const fs = require('fs')
require('dotenv').config()
// ********************cloudinary config part ****************
const cloudinary = require('cloudinary').v2

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

// **********************doctorlist******************

// add doctor data in databased
exports.addDoctor = async (req, res) => {
    try {
        let image = null
        // checking data validation
        const { error } = doctor_valid(req.body)
        if (error) {
            return res.json(error.details[0].message)
        }
        // checking image file
        if (req.file) {
            let localpath = req.file.path.replace(/\\/g, '/')
            let url = await uploadtocloud(localpath)
            image = url
            fs.unlinkSync(localpath)
        }

        //doctor data save in  model 
        const doctorData = new Doctor({
            name: req.body.name,
            qualification: req.body.qualification,
            education: req.body.education,
            expirence: req.body.expirence,
            profile: image
        })
        try {
            const result = await doctorData.save()
            const { ...data } = result._doc
            res.json(data)
        } catch (error) {
            res.json(error)
        }

    } catch (error) {
        res.json(error)
    }

}


// delete doctor data in databased
exports.deleteDoctor = async (req, res) => {
    try {
        const data = await Doctor.findByIdAndDelete(req.params.id)
        try {
            if (!data) {
                return res.status(400).send('wrong id are given')
            }
            res.send(`data is deleted ${data._id}`)
        } catch (error) {
            return res.send('error in client side')
        }


    } catch (error) {
        res.send(error)
    }
}


// update doctor data in databased
exports.updateDoctor = async (req, res) => {
    try {
        let image = null
        // checking data validation
        const { error } = doctor_valid(req.body)
        if (error) {
            return res.json(error.details[0].message)
        }
        // checking image file
        if (req.file) {
            let localpath = req.file.path.replace(/\\/g, '/')
            let url = await uploadtocloud(localpath)
            image = url
            fs.unlinkSync(localpath)
        }
        const newUpdatedData = {...req.body,profile:image}
        const data = await Doctor.findByIdAndUpdate(req.params.id, {
            $set: newUpdatedData
        }, { new: true })
        try {
            if (!data) {
                return res.status(400).send('wrong id are given')
            }
            res.send(`data is updated ${data}`)
        } catch (error) {
            return res.send('error in client side')
        }

    } catch (error) {
        res.send(error)
    }
}


// find data in databased by id
exports.findDoctor = async (req, res) => {
    try {
        const data = await Doctor.find()
        if (!data) {
            return res.send('not find data')
        }
        res.render('doctorlist')
    } catch (error) {
        res.send(error)
    }
}


