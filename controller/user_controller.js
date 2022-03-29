const bcrypt = require('bcrypt')
const User = require('../models/usermodel')
const Comment = require('../models/commentmodel')
const Doctor = require('../models/doctormodel')
const Banner = require('../models/bannermodel')
const { reg_valid, login_valid } = require('../auth/valid')
const jwt = require('jsonwebtoken')
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


// ********************user router***********************

// create signup user
exports.registerUser = async (req, res) => {
    let msg = null
    try {
        // checking data validation
        const { error } = reg_valid(req.body)
        if (error) {
            msg = error.details[0].message
            console.log(msg)
            return res.render('signup', {
                msg
            })
        }

        // checking duplicate email not save in databased
        const userdata = await User.findOne({ email: req.body.email })
        if (userdata) {
            msg = 'email already exist'
            return res.render('signup', {
                msg
            })
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        //new data model create
        const newdata = new User
            ({
                username: req.body.username,
                email: req.body.email,
                isAdmin: req.body.isAdmin,
                password: hashPassword,
            })

        try {
            //save to database
            const result = await newdata.save()
            const { ...data } = result._doc
            msg = 'account created successfully'
            res.render('signUp', {
                msg
            })
        } catch (error) {
            res.send(error)
        }

    } catch (error) {
        res.send(error)
    }

}


// login user
exports.loginUser = async (req, res) => {
    let msg = null
    try {
        //checking valid data form client 
        const { error } = login_valid(req.body)
        if (error) {
            msg=error.details[0].message
            return res.render('login',{
                msg
            })
        }

        //checking email available in database or not
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            msg='user not exist'
            return res.render('login',{
                msg
            })
        }
        //compare hash password
        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if (!validpassword) {
            msg='password is incorrect'
            return res.render('login',{msg})
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

        res.redirect('/user/dashboard')

    } catch (error) {
        res.send(error)
    }

}


// update the user
exports.userUpdate = async (req, res) => {
    try {
        let image = null
        // checking data validation
        const { error } = reg_valid(req.body)
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

        // checking password 
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const newUpdatedData = { ...req.body, profile: image }
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: newUpdatedData,
            }, { new: true })
            res.status(200).json(updateUser)
        } catch (error) { res.status(500).json(error) }

    } catch (error) {
        res.send(error)
    }
}

// delete the user

exports.userDelete = async (req, res) => {
    try {
        const userdata = await User.findByIdAndDelete(req.params.id)
        try {
            if (!userdata) {
                res.send('wrong id ')
            }
            res.send(`user is delete ${userdata}`).status(500)
        } catch (error) {
            res.send(error)
        }

    } catch (error) {
        res.send(error).status(500)
    }
}


// find user by id
exports.findUser = async (req, res) => {
    try {
        const userdata = await User.findById(req.params.id)
        try {
            if (!userdata) {
                res.send('wrong id ')
            }
            res.send(userdata).status(200)
        } catch (error) {
            res.send(error)
        }

    } catch (error) {
        res.send(error).status(500)
    }
}








//website dashboard
exports.dashboard = async (req, res) => {
    if (req.user) {
        const user = await User.findById(req.user.id)
        const commentlist = await Comment.find()
        const doctorlist = await Doctor.find()
        const bannerlist = await Banner.find()
        console.log(user)
        res.render('dashboard',{
            comment: commentlist,
            doctor: doctorlist, 
            banner: bannerlist,
            name:user.username
        })

    } else {
        res.json('user not login')
    }
}

exports.getabout = async(req,res)=>{
    res.render('about')
}

// find data in databased
exports.findAllDoctor = async (req, res) => {
    let msg = null
    try {
        const data = await Doctor.find()
        if (!data) {
            msg='not doctor are available'
            return res.render('doctor',{msg})
        }
        res.render('doctor',{data})

    } catch (error) {
        res.send(error)
    }
}




exports.logout = async (req, res) => {
    // const { user } = req
    // const session = invalidateSession(user.sessionId)
    // set access token cookie
    // res.cookie('accessToken', "", {
    //     maxAge: 0,
    //     httpOnly: true
    // })
    // set refresh token cookie
    // res.cookie('refToken', "", {
    //     maxAge: 0,
    //     httpOnly: true
    // })
    // return res.send('you are logout  ' + session)

    // clear the cookie
    res.clearCookie("accessToken");
    // redirect to login
    return res.redirect("/user/login");
}


exports.sessionHandler = (req, res) => {
    return res.send(req.user)
}


// ******************************page function **************


exports.getlogin = (req, res) => {
    res.render('login')
}

exports.getsignup = (req, res) => {
    res.render('signUp')
}
exports.getprofile = (req, res) => {
    res.render('profile')
}
