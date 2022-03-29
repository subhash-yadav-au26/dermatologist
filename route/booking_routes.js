const router = require('express').Router()
const Booking = require('../controller/booking_controller')
const {auth} = require('../auth/jwt_auth')


router.post('/booking',auth,Booking.booking)
router.get('/booking',auth,Booking.getbooking)
router.get('/appointment',auth,Booking.getappointment)

module.exports = router