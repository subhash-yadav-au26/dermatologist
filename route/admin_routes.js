const router = require('express').Router()
const {verifyTokenAndAdmin, auth} = require('../auth/jwt_auth')
const multer  = require('multer');


// store the file in upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({storage:storage})



//*************admin login******************* */
const {adminlogin,adminlogins,dashboard,findAllUser} = require('../controller/admin_controller')

router.get('/login',adminlogin)

router.post('/login',adminlogins)

router.get('/dashboard',verifyTokenAndAdmin,dashboard)

//find  all user
router.get('/user',verifyTokenAndAdmin,findAllUser)


// ***********************booking router*************************

const admin = require('../controller/admin_controller')



// find booking by id
router.get('/appointment',verifyTokenAndAdmin,admin.allBooking)

// find booking by id
router.get('/booking/:id',verifyTokenAndAdmin,admin.searchBooking)

// update booking
router.put('/booking/:id',verifyTokenAndAdmin,admin.updateBooking)

// delete booking 
router.delete('/booking/:id',verifyTokenAndAdmin,admin.deleteBooking)



// ************************doctor routes*********************

const {addDoctor,deleteDoctor,updateDoctor,findDoctor,findAllDoctor, getDoctor} = require('../controller/doctor_controller')

// create doctor
router.post('/doctor',upload.single('file'),verifyTokenAndAdmin,addDoctor)

//delete doctor
router.delete('/doctor/:id',verifyTokenAndAdmin,deleteDoctor)

// update doctor
router.put('/doctor/:id',upload.single('file'),verifyTokenAndAdmin,updateDoctor)

// find doctor by id
router.get('/doctors',verifyTokenAndAdmin,findDoctor)




// ********************end doctor part******************







// ********************Banner routers***************************

const {findBanner,deleteBanner, addBanner} = require('../controller/banner_controller');


// create banner 
router.post('/banner',upload.single('file'),verifyTokenAndAdmin,addBanner)


// delete banner
router.delete('/banner/:id',verifyTokenAndAdmin,deleteBanner)

//find banner
router.get('/banner',verifyTokenAndAdmin,findBanner)



module.exports = router