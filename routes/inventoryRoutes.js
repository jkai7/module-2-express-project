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

// router.get('/', (req,res,next)=> {
//     res.render('inventory/inventory');
// })

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
    image: `/images/${req.file.filename}`,
    owner: req.user
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
    // get all the stuff from DB
  Product.find()
  .then(reponseFromDb => {
      // reponseFromDb => these are all the products that are currently in DB
      const myStuff = [];
      // take the array of all products and for each item check if 
      // oneThing.owner.equals(req.user._id) => the owner of the item (represented by ID in DB) is the same combination of nubmers as the USER ID
      // i can' use if (oneThing.owner === req.user._id) because I work with mongo database id's so I need to use .equals() js method
      reponseFromDb.forEach( oneThing => {
          if(oneThing.owner.equals(req.user._id)){
              // if the condition is true, push the item into the myStuff array
              myStuff.push(oneThing)
          }
          //                                  // send myStuff array to be displayed as products in hbs
          res.render("inventory/inventory", { products: myStuff, user: req.user });
      })
      
  })
  });//==END 


  // details page
  router.get('/:productId', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
      const productId = req.params.productId;
      Product.findById(productId)
      .then( productFromDb => {
          console.log(productFromDb)
          res.render('inventory/productDetails', { theProduct: productFromDb, user: req.user })


      } )//==End then
      .catch( error => {
          console.log("Error while displaying product details: ", error);
      } )



  })//==End details page


// delete product page

router.get('/:productId/delete', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
    const productId = req.params.productId;

    User.findById(productId)
    .then(foundUser => {
        res.render('inventory/productDetails', { product: foundProduct })
    })
    .catch( err => {
        console.log("Error while displaying edit form: ", err)
    })
})




router.post('/:productId', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
    

   

    // function deleteProduct(){
    // const productId = req.params.productId;

    // // const newUsername = req.body.updatedUsername;
    // // const newFirstname = req.body.updatedFirstname;
    // // const newLastname = req.body.updatedLastname;
    // // const newEmail = req.body.updatedEmail;
    // // const newImage = `/images/${req.file.filename}`


    // product.findByIdAndRemove(req.params.productId, (err, product))
    // .then( (product) => {
    //     res.redirect(`/inventory`)
    // } )
    // .catch(error => {
    //     console.log("Error while deleting product: ", error)
    // })
    // }
})//==END product delete



module.exports = router; 



// function deleteProduct(){
// const productId = req.params.productId;
// Product.findByIdAndRemove(productId, (err, Product))
// .then( (product) => {
//     res.redirect(`/inventory`)
// } )
//     .catch(error => {
//         console.log("Error while deleting product: ", error)
//  })
// }


