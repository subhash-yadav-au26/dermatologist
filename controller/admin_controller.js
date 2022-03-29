const Booking = require('../models/booking_model')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/usermodel')
const {login_valid } = require('../auth/valid')
require('dotenv').config()



// *********************booking************************
exports.adminlogin = (req,res)=>{
    res.render('adminlogin')
}

// login user
exports.adminlogins = async (req, res) => {
    let msg = null
    try {
        //checking valid data form client 
        const { error } = login_valid(req.body)
        if (error) {
            msg=error.details[0].message
            return res.render('adminlogin',{
                msg
            })
        }

        //checking email available in database or not
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            msg='user not exist'
            return res.render('adminlogin',{
                msg
            })
        }
        //compare hash password
        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if (!validpassword) {
            msg='password is incorrect'
            return res.render('adminlogin',{msg})
        }

        const payload = { id: user._id, isAdmin: user.isAdmin }
        const secret = process.env.SECRET
        const options = { expiresIn: process.env.EXPIRE }

        //access token generated
        const newToken = jwt.sign(payload, secret, options)

        //refresh token  secret
        const ref_secret = process.env.REF_SECRET
        const refoptions = { expiresIn: process.env.refresh_expire }
        // refresh token genreate
        const newrefreshToken = jwt.sign(payload, ref_secret, refoptions)

        //set access token cookie
        const accessToken = "Bearer " + newToken

        res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 60 *24, //5min
            httpOnly: false
        })

        // set refresh token cookie
        const refreshToken = "Bearer " + newrefreshToken

        // res.cookie('refresh', refreshToken, {
        //     maxAge: 3.154e418, //1year
        //     httpOnly: false
        // })

        res.redirect('/admin/dashboard')

    } catch (error) {
        res.send(error)
    }

}

// admin dashboard
exports.dashboard = (req,res)=>{
    res.render('admin')
}

//search booking by admin
exports.searchBooking = async (req, res) => {
    try {
        const id = req.params.id
        const check_booking = await Booking.findById(id)
        if (!check_booking) {
            return res.send('no booking are found').status(400)
        }
        else {
            return res.send(check_booking)
        }
    } catch (error) {
        res.send('not find id').status(500)
    }
}


//get booking by admin
exports.allBooking = async (req, res) => {
    try {
            let bookedData = await Booking.find()
            console.log(bookedData)
            res.render('appointment',{
              newData:bookedData
            })

    } catch (error) {
        res.send('not find id').status(500)
    }
}



// delete the booking
exports.deleteBooking = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.send({ message: 'id not provided' })
        }
        const deleteData = await Booking.findByIdAndDelete(id)
        try {
            if (!deleteData) {
                res.status(404).send({ message: `cannot delete with id ${id} may be wrong ` })
            }
            else {
                // send email to user of booking number
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: req.body.email,
                    subject: 'APPOINTMENT IS CANCEL',
                    text: 'your booking CANCEL '
                };
                // send email to booked by user
                await transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.send({ message: "user was deleted successfully" })
            }
        }
        catch (error) {
            res.status(500).send('error occuring to retriving the data')
        }
    } catch (error) {
        res.send(error)
    }
}


//update the booking
exports.updateBooking = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: "data to update can not be empty" })
        }
        const data = await Booking.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        try {
            if (!data) {
                res.status(404).send({ message: `cannot update user with ${id} maybe user id not found` })
            }
            else {
                // send email to user of booking number
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: req.body.email,
                    subject: 'APPOINTMENT UPDATE ',
                    text: 'your booking id is ' + data._id
                };
                // send email to booked by user
                await transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.send(data)
            }

        } catch (error) {
            res.status(500).send('error occuring to retriving the data')
        }
    } catch (error) {
        res.send(error).status(500)
    }
}

// find user all in databased
exports.findAllUser = async (req, res) => {
    try {
        const query = req.query.new;
        const userdata = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find()
        try {
            if (!userdata) {
                res.send('wrong id ')
            }
            res.render('users')
        } catch (error) {
            res.send(error)
        }

    } catch (error) {
        res.send(error).status(500)
    }
}











