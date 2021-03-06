const express     = require('express');
const router      = express.Router();
//==Models
const User        = require('../models/user');
const Product     = require('../models/product');
// const Picture     = require('../models/pictures');
//==passport 
const bcrypt      = require('bcrypt');
const saltRounds  = 10;
const passport    = require('passport')
const ensureLogin = require("connect-ensure-login");
//==multer
const cloudinary = require('cloudinary');
const multer = require('multer');
const uploadCloud = require('../config/cloudinary.js');


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

      const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: hashPass,
        email: email
      });
  
      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/login");
        }
      });
    });
})//==END signup POST


/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('auth/login', { "message": req.flash("error") })
});//==END login

/* Post login page */
router.post('/login', passport.authenticate('local',
{
  successRedirect: "/explore",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))//==END login post

/* Get explore page */
router.get('/explore', ensureLogin.ensureLoggedIn('/login'), (req,res, next) => {
  console.log("user in explore: ", req.user)
  res.render('auth/explore', {user: req.user})
})//==END success page

/* Get furniture page */
router.get("/furniture", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find({'productType': 'Furniture'})
  .then(reponseFromDb => {
    console.log("reponseFromDb: ", reponseFromDb)
      res.render("auth/furniture", { products: reponseFromDb, user: req.user });
  })//==END 
})//==END furniture page

/* Get electronics page */
router.get("/electronics", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find({'productType': 'Electronics'})
  .then(reponseFromDb => {
    console.log("reponseFromDb: ", reponseFromDb)
      res.render("auth/electronics", { products: reponseFromDb, user: req.user });
  })//==END 
})//==END electronics page

/* Get Home Appliances page */
router.get("/homeAppliances", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find({'productType': 'Home Appliances'})
  .then(reponseFromDb => {
    console.log("reponseFromDb: ", reponseFromDb)
      res.render("auth/homeAppliances", { products: reponseFromDb, user: req.user });
  })//==END 
})//==END Home Appliances page

/* Get Instruments page */
router.get("/instruments", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find({'productType': 'Instruments'})
  .then(reponseFromDb => {
    console.log("reponseFromDb: ", reponseFromDb)
      res.render("auth/instruments", { products: reponseFromDb, user: req.user });
  })//==END 
})//==END Home Instruments page

/* Get Outdoor Equipment page */
router.get("/outdoorEquipment", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find({'productType': 'Outdoor Equipment'})
  .then(reponseFromDb => {
    console.log("reponseFromDb: ", reponseFromDb)
      res.render("auth/outdoorEquipment", { products: reponseFromDb, user: req.user });
  })//==END 
})//==END Outdoor Equipment page

 
/* GET logout page */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});//==END logout

/* GET private page */ 
// router.get("/private", ensureLogin.ensureLoggedIn('/bestow/login'), (req, res) => {
//   res.render("auth/private", { user: req.user });
// });//==END private page

module.exports = router;
