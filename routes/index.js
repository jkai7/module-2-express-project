const express     = require('express');
const router      = express.Router();
const User        = require('../models/user');
const bcrypt      = require('bcrypt');
const saltRounds  = 10;
const passport    = require('passport')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});//==END Index

/* GET about page */
router.get('/about', (req, res, next) => {
  res.render('auth/about');
});//==END about


/* GET signup page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
});//==END signup


/* POST signup page */
router.post('/signup', (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  
  if( firstname === "" || lastname === "" ){
    res.render('auth/signup', {message: 'Enter valid First or Last name'})
    return;
  }else if( username === "" || password === ""){
    res.render('auth/signup', {message:'Enter valid Username or Password'})
    return;
  }else if( email === ""){
    res.render('auth/signup', {message: 'Enter valid E-mail'})

    return;
  }

  User.findOne({username: username, email: email})
    .then((user) => {
      if( user !== null){
        res.render('auth/signup', {message: 'Sorry, Username or E-mail already exists'})
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        firstname: firstname,
        lastname: lastname,
        username: username, 
        password: hashPass, 
        email: email
      })
      .then((theUser) => {
        res.redirect('/bestow/login')
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })//==END create user

    })//=End .then user findOne
    .catch((err) => {
      next(err)
    })

})//==END signup POST


/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('auth/login')
});//==END login

/* Post login page */
router.post('/login', passport.authenticate('local',
{
  successRedirect: "/bestow/success",
  failureRedirect: "/bestow/login",
  failureFlash: true,
  passReqToCallback: true
}))//==END login post


/* Get success login */
router.get('/success', (req,res, next) => {
  res.render('auth/success')
})//==END success page

/* GET logout page */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/bestow/login");
});//==END logout

module.exports = router;
