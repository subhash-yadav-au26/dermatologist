const router = require("express").Router();

const {
  registerUser,
  loginUser,
  userUpdate,
  userDelete,
  findUser,
  dashboard,
  getabout,
  logout,
  getlogin ,
  getsignup,
  getprofile,
  getbooking,
  findAllDoctor
} = require('../controller/user_controller')

const {auth,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../auth/jwt_auth')





//****************user login signup dashboard page********** */

// signup page
router.post('/signup',registerUser)

//login page
router.post('/login',loginUser)

//dashboard page
router.get('/dashboard',dashboard)

//logout 
router.get('/logout',logout)


// ***************************user profile*****************************

const multer = require('multer')

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
  
const upload = multer({ storage: storage})


//user router
router.put('/update/:id',verifyTokenAndAuthorization,upload.single('file'),userUpdate)


//delete the user
router.delete('/delete/:id',verifyTokenAndAuthorization,userDelete)


// find the user by id
router.get('/find/:id',verifyTokenAndAdmin,findUser)





//******************comments router**********************

const {createComment,deleteComment,updateComment} = require('../controller/comment_controller')

// create comment by user
router.post('/comment',auth,createComment)

// delete comment by user
router.delete('/comment/:id',verifyTokenAndAuthorization,deleteComment)

// update comment by user
router.put('/comment/:id',verifyTokenAndAuthorization,updateComment)


// *****************************page show********************

router.get('/login',getlogin)
router.get('/signup',getsignup)
router.get('/about',getabout)
router.get('/doctors',auth,findAllDoctor)









module.exports= router