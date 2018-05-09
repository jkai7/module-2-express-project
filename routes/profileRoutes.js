const express     = require('express');
const router      = express.Router();
//==Models
const User        = require('../models/user');
const ensureLogin = require("connect-ensure-login");
// setup for image upload
const multer = require('multer');
const path = require('path');

const myUploader = multer({
    dest:path.join( __dirname, '../public/images')
   });


   /* GET profile page */
router.get('/:id', ensureLogin.ensureLoggedIn('/bestow/login'), (req,res, next) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(userFromDb => {
            res.render('profile/profile', {user: userFromDb})
        })
        .catch(error => {
            console.log("Error while displaying profile info ", error)
        })
  });//==END profile page
  


// edit profile

router.get('/:id/edit', ensureLogin.ensureLoggedIn('/bestow/login'), (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId)
    .then(foundUser => {
        res.render("profile/editProfile", { user: foundUser })
    })
    .catch( err => {
        console.log("Error while displaying edit form: ", err)
    })
})


router.post('/:id', ensureLogin.ensureLoggedIn('/bestow/login'), myUploader.single('userImage'), (req, res, next) => {
    const userId = req.params.id;

    const newUsername = req.body.updatedUsername;
    const newFirstname = req.body.updatedFirstname;
    const newLastname = req.body.updatedLastname;
    const newEmail = req.body.updatedEmail;
    const newImage = `/images/${req.file.filename}`


    User.findByIdAndUpdate(userId, {
        username: newUsername,
        firstname: newFirstname,
        lastname: newLastname,
        email: newEmail,
        image: newImage
    })
    
//     .then(() => {
//         if( image == null){
//           res.render(`/:id/edit`, {user: userFromDb, message: 'Need an Avatar!'})
//         }else{
//             res.redirect(`/bestow/profile/${userId}`)
        
// }})
    
.then( (user) => {
        res.redirect(`/bestow/profile/${userId}`)
    } )
    .catch(error => {
        console.log("Error while saving updates: ", error)
    })

})




module.exports = router;

