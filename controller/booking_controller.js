const Booking = require('../models/booking_model')
const User = require('../models/usermodel')
const { booking_valid } = require('../auth/valid')
const nodemailer = require('nodemailer');
require('dotenv').config()

exports.booking = async (req, res) => {
  let msg = null
  try {
      const id = req.user.id
      const bookingByUser = await User.findById(id)
      const bookingBy = bookingByUser.username
      const bookingemail = bookingByUser.email
      // checking data validation
      const { error } = booking_valid(req.body)
      if (error) {
        msg=error.details[0].message
        return res.render('booking',{msg})
      }

      // email check for not dubplicate 
      const bookingUser = await Booking.findOne({ email: req.body.email })
      if (bookingUser) {
        msg='email one time valid'
        return res.render('booking',{msg})
      }

      // phone number shoude  different
      const bookingUserphone = await Booking.findOne({ phone: req.body.phone })
      if (bookingUserphone) {

        msg='phone number one time valid'
        return res.render('booking',{msg})
    
      }

      //new data model create
      const bookingData = new Booking
        ({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          date: req.body.date,
          bookedBy:bookingBy,
          bookbyemail:bookingemail,
          message: req.body.message
        })


      try {
        //save user booking to database
        const result = await bookingData.save()
        const { ...data } = result._doc


        // send email to user of booking number
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "dermatologist-out@outlook.com", 
              pass: "newDarmo1@", 
            },
        });

        const mailOptions = {
          from: "dermatologist-out@outlook.com",
          to: req.body.email,
          subject: 'APPOINTMENT BOOKING',
          text: 'your booking id is ' + data._id
        };
        // send email to booked by user
        // await transporter.sendMail(mailOptions, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
        msg='your booking has to successfull'
        res.render('booking',{msg})

      } catch (error) {
        res.send(error)
      }

  } catch (error) {
    res.send(error)
  }

}

exports.getbooking = (req, res) => {
  res.render('booking')
}

exports.getappointment = async(req, res) => {
  try {
    let user = await User.findById(req.user.id)
    let bookedData = await Booking.find({bookbyemail:user.email}).lean()
    res.render('appointment',{
      bookedData
    })
  } catch (error) {
    
  }
}

