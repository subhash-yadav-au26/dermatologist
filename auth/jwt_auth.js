const jwt = require('jsonwebtoken');
require('dotenv').config()

const auth = (req,res,next)=>{
    try {
        // access token from header
        const authHeader = req.cookies.accessToken

        if(authHeader){
            //split payload from token
            const token = authHeader.split(' ')[1]
            try {
                jwt.verify(token,process.env.SECRET,(err,user)=>{
                    if(err){
                        return res.redirect('/user/login')
                        // return res.send('token is not valid !').status(401);
                    }
                    req.user = user
                    next()
                })
            } catch (error) {
                res.redirect('/user/login')
                // res.json({
                //     data:"authentication error",
                //     success:false
                // })
            }
        }
        else{
            // return res.redirect('/user/login')
            return res.send('you are not authenticated!').status(401)
        }
        
    } catch (error) {
        res.send(error)       
    }
}

// it is verify the user and admin
const verifyTokenAndAuthorization = (req,res,next)=>{
    auth(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            
            next()
        }else{

            res.status(403).json('you are not valid user or admin')
        }
    })
}

// it is verify  admin
const verifyTokenAndAdmin = (req,res,next)=>{
    auth(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json('you are not admin')
        }
    })
}

module.exports ={auth,verifyTokenAndAuthorization,verifyTokenAndAdmin}