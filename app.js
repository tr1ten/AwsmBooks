const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const HttpError = require('./utils/HttpError')
const shoproute = require('./routes/shop');
const userroute = require('./routes/auth');
const session = require('express-session');
const flash = require('connect-flash');
const  LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const passport = require('passport')
engine = require('ejs-mate')

//Mongoose db connection
mongoose.connect('mongodb://localhost:27017/BooksStore').then(() => {
    console.log('Succesfully connected to Db!')
}).catch((e) => {
    console.log('error occured!', e)
})
// Setting up express server
const app = express()
// override with the _method in the query
app.use(methodOverride('_method'))
const port = 3000
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge:1000*24*60*60*7
     }
}))
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.use(flash());
//passport setup 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// adding middleware to inject flash message to views  locals
app.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.message = req.flash('info');
    res.locals.error = req.flash('error');
    next()
})


// Routing  -->
app.use('/shop', shoproute)
app.use('/', userroute)

app.get('/', (req, res) => {
    res.render('index')
})

app.all('*', (req, res) => {
    throw new HttpError('Page not found', 404)
})
app.use((err, req, res, next) => {
    res.render('./pages/error.ejs', { err })

})

app.listen(port, () => console.log(`Example app listening on port ${port}`))