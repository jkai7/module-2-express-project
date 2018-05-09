const express     = require('express');
const router      = express.Router();
//==Models
const User        = require('../models/user');
const Product     = require('../models/product');

const ensureLogin = require("connect-ensure-login");

// setup for image upload
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const uploadCloud = require('../config/cloudinary.js');


const myUploader = multer({
    dest:path.join( __dirname, '../public/images')
   });
// create inventory - get the form

router.get('/create', ensureLogin.ensureLoggedIn('/login'), (req,res,next) => {
    res.render("inventory/newInventory", {user: req.user})
})

// create inventory - post the form
                                          
router.post('/create', ensureLogin.ensureLoggedIn('/login'), myUploader.single('productImage'), (req, res, next) => {
    // console.log("body is: ", req.body)
 const newProduct = new Product({
    productname: req.body.productName,
    productType: req.body.types,
    description: req.body.productDescription,
    condition: req.body.condition,
    price: req.body.productPrice,
    city: req.body.productCity,
    areaCode: req.body.productAreaCode,
    image: `/images/${req.file.filename}`
 })
    newProduct.save()
    .then(() => {
        res.redirect('/inventory')
    })
    .catch( err => {
        console.log("Error while saving the new product: ", err)
    })
})//==END create new product

router.get("/", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Product.find()
  .then(reponseFromDb => {
      res.render("inventory/inventory", { products: reponseFromDb, user: req.user });
  })
  });//==END 

  // details page
  router.get('/:productId', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
      const productId = req.params.productId;
      Product.findById(productId)
      .then( productFromDb => {
          console.log(productFromDb)
          res.render('inventory/productDetails', { theProduct: productFromDb, user: req.user })
      } )
      .catch( error => {
          console.log("Error while displaying product details: ", error);
      } )
  })
module.exports = router;