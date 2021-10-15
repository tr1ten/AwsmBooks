const express = require('express')
const passport = require('passport')
const User = require('../models/user')
router = express.Router()
router.get('/login', (req, res) => {
  res.render('./pages/auth_screen', { doLogin: true })
})
router.get('/register', (req, res) => {
  res.render('./pages/auth_screen', { doLogin: false })
})

router.use(express.urlencoded({ extended: true }))
router.post('/login', passport.authenticate('local',{failureFlash:true}), (req, res) => {
  console.log('loggeed in')
  req.flash('info','succesfully logged in')
  res.redirect('/');
})
router.post('/logout', (req, res) => {
  delete res.locals.user;
  req.logout();
  req.flash('info','successfully logout!')
  res.redirect('/')
})

router.post('/register', async (req, res) => {
  try {
    
    console.log('got register req',req.body)
    const { username, email, password } = req.body;
    const newUser = new User({ username: username, email: email })
    const newRegisteredUser = await User.register(newUser, password)
    req.login(newRegisteredUser,err=>next(err))
    
    req.flash('info','Succesfully logged in')
    res.redirect('/')
  }
  catch(e){
    req.flash('error','Something went wrong , please try again!',e.message)
    res.redirect('/register')
  }
})



module.exports = router;