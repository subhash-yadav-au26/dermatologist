const express = require('express');
const helmet = require("helmet");
const app = express();
require('dotenv').config()
const PORT = process.env.PORT ||3000
// mongoose connection
const {mongoDB} = require('./config/databased')
mongoDB()

//set engine template
const {engine} = require('express-handlebars')
app.engine('hbs',engine({
    defaultLayout:'main',
    extname:'.hbs'
}))

app.set('view engine','hbs')

//serving statics file
app.use(express.static('assets'))

//middle ware for data transfer client to server
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
app.use(cookieparser())
app.use(helmet())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


// route for website
const userRouter = require('./route/user_routes')
app.use('/user',userRouter)


// user booking routes
const bookingRoute = require('./route/booking_routes')
app.use('/booking',bookingRoute)


//admin routes
const adminRoute = require('./route/admin_routes');
app.use('/admin',adminRoute)

app.get('*',(req,res)=>{
    res.render('notfound')
})


app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})