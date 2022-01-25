const express = require('express')
const path = require('path');
const validate = require('./utils/validate')
const uservalidate = require('./utils/uservalidate')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const HttpError = require('./utils/HttpError')
const shoproute = require('./routes/shop');
const userroute = require('./routes/auth');
const session = require('express-session');
const flash = require('connect-flash');
const  LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Subscription = require('./models/subscription');
const passport = require('passport')
const dotenv = require('dotenv');
const {getConsumer} = require('./utils/mq_consumer');
const {getPublisher} = require('./utils/mq_publisher');
const { cookie } = require('express/lib/response');
const asyncwrap = require('./utils/asyncwrap');
function getCookie(name,cookieString) {
    var nameEQ = name + "=";
    var ca = cookieString.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
let pub;
async function startMe(){
    const listUsers = await User.find({});
    const usersL = [];
    for (let user of listUsers) {
        usersL.push(user._id?.toString())
    }
    pub = await getPublisher('notify','direct',usersL,()=>{},process.env.AMQP_URL);
    await pub.start();
};
startMe()
engine = require('ejs-mate')
dotenv.config()
//'mongodb://localhost:27017/BooksStore' process.env.ATLAS_URL
//Mongoose db connection
mongoose.connect(process.env.ATLAS_URL).then(() => {
    console.log('Succesfully connected to Db!')
}).catch((e) => {
    console.log('error occured!', e)
})
// Setting up express server
const app = express()
const io = require('socket.io')();
io.on('connection', async function (socket) {
    
    const userId=getCookie('uid',socket.request.headers.cookie);
    if(!userId)
    {
        console.log("no token found returning");
        return;
    }
    else{
        console.log('client connected ',socket.id);
    }
    const sub= await getConsumer(userId,'notify','direct',(err)=>console.log("error occ ",err),process.env.AMQP_URL);
    const onMessage = async (message)=>{
        console.log("got a message ",message?.content?.toString())
        socket.emit(userId, message?.content?.toString());
    }
    await sub.start(onMessage)
    socket.on('disconnect',()=>{
        console.log("disconnected ",socket.id);
        sub.close();
    })
    });
  

// override with the _method in the query
app.use(methodOverride('_method'))
const port = 3000
const expressSession = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge:1000*24*60*60*7
     }
});
app.use(expressSession)
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

// notifying users
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.put('/shop/:id', uservalidate, asyncwrap(async (req,res,next)=>{
    try{
        const {id} = req.params;
        const subscriptions = await Subscription.find({itemId:id}).populate(['itemId','userId']);
        console.log("all subs is ",subscriptions)
        for (const sub of subscriptions) {
            if(!sub.userId._id.equals(req.user._id))
            {
                console.log('publishing to ',sub.userId.username,'item id:',sub.itemId.title,'with user id:',sub.userId._id.toString());
                pub.publish(sub.userId._id.toString(),`${sub.itemId.title} has been edited by ${req.user.username}!`)
            }
        }
        console.log("sucessful publish to all users")
        next();
    }
    catch(error)
    {

        next(error);
    }


})
)


// Routing  -->
app.use('/shop', shoproute)
app.use('/', userroute)

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/notifications',(req,res)=>{
    res.render('pages/notifications')
})
app.all('*', (req, res) => {
    throw new HttpError('Page not found', 404)
})
app.use((err, req, res, next) => {
    res.render('./pages/error.ejs', { err })

})

const  serverIns =  app.listen(port, () => console.log(`Example app listening on port ${port}`))
io.use((socket,next)=>{
    expressSession(socket.request,{},next)
})
io.attach(serverIns);