const { verifyJWT } = require("jsonwebtoken")

exports.deserial =(req,res,next)=>{
    const {accessToken,refreshToken} = req.cookies
    if(!accessToken){
        return next()
    }
    const {user,expired} = verifyJWT(accessToken)

    //access token is valid
    if(user){
        req.user = user
        return next()
    }

    const {refresh} = expired && refreshToken ? verifyJWT(refreshToken) :null

    if(!refresh){
        return next()
    }
    const session = getsession(refresh.sessionId)
    if(!session){
        return next()
    }
    const newAccessToken = signJwt(session,'5s');
    res.cookie('accessToken',newAccessToken,{
        maxAge:300000,
        httpOnly:true
    })
    req.user = verifyJWT(newAccessToken).payload;
    return next()

}