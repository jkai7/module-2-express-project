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



router.get('/borrowed', ensureLogin.ensureLoggedIn('/login'), (req,res,next) => {
const borrowed = []

if(req.user.productsBorrowed.length >0){

req.user.productsBorrowed.forEach((oneProduct, i) => {
    // console.log("-----------------", oneProduct)
    Product.findById(oneProduct)
        .then((theProduct) => {
            borrowed.push(theProduct)
        })
        
        .then(() => {
            if(i === req.user.productsBorrowed.length -1){

                res.render("inventory/borrowed", {user: req.user, products: borrowed})
            }

        });
})
} else{
    res.render("inventory/borrowed", {user: req.user})
}



})//==END borrowed


/* return */
router.post('/returned', ensureLogin.ensureLoggedIn('/login'), (req,res,next) => { 

    const productId = req.body.productId
    Product.findById(productId)
        .then((theProduct) =>{
            theProduct.isAvailable = true
            theProduct.save()
                
        })

User.findById(req.user._id)
    .then((theUser) => {
        //==where in the array is the product id
        const index = theUser.productsBorrowed.indexOf(productId)
        theUser.productsBorrowed.splice(index, 1)
        theUser.save()
            .then(() => {
                res.redirect('/inventory/borrowed')
            })
    })

});//==END returned 


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
    owner: req.user,
    ownerName: req.body.productOwnerName
 }) 
    newProduct.save()
    .then(() => {
        res.redirect('/inventory')
    })
    .catch( err => {
        console.log("Error while saving the new product: ", err)
    })
})//==END create new product


/* inventory page */
router.get("/", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  
    // get all the stuff from DB
  Product.find()
  .then(reponseFromDb => {
      // reponseFromDb => these are all the products that are currently in DB
      const myStuff = [];
//    if(myStuff.length === 1){

       // take the array of all products and for each item check if 
       // oneThing.owner.equals(req.user._id) => the owner of the item (represented by ID in DB) is the same combination of nubmers as the USER ID
       // i can' use if (oneThing.owner === req.user._id) because I work with mongo database id's so I need to use .equals() js method
       reponseFromDb.forEach( oneThing => {
           if(oneThing.owner.equals(req.user._id)){
               // if the condition is true, push the item into the myStuff array
               myStuff.push(oneThing)
             }   
           //                                  // send myStuff array to be displayed as products in hbs
        })
        //    } else {
            res.render("inventory/inventory", { products: myStuff, user: req.user });
    // res.render("inventory/inventory")
   

      
  })
  });//==END 





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

router.post('/:productId/delete', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
    
    
    const productId = req.params.productId;

        Product.findByIdAndRemove(productId)
        .then(() => {
           
            res.redirect("/inventory");
            
        })
        .catch( error => {
            console.log("Error while deleting: ", error)
        })

})//==END product delete



router.post('/borrow/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(foundProduct => {
        // console.log("blahhhhhhh: ", foundProduct)
        foundProduct.isAvailable = false;
        foundProduct.save()
        .then((product) => {
            console.log("product after saving: ", product)
            req.user.productsBorrowed.push(foundProduct);
            req.user.save()
            .then((user) => {
                console.log("user after saving: ", user)
                res.redirect('/explore')
            })
            .catch(err => {
                console.log("err while borrowing: ", err)
            })
        })
        .catch(err => {
            console.log("err while saving product filed: ", err)
        })
        // console.log("found : ", foundProduct)
    })
    .catch(err => {
        console.log("err while findnig the product: ", err)
    })
})//==END borrow post 


  // details page
  router.get('/:productId', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
    const productId = req.params.productId;
    const isOwner = false;
    var isReallyAvailable = false;
    Product.findById(productId)
    .then( productFromDb => {
      //   console.log(productFromDb)
      if(productFromDb.owner.equals(req.user._id)){
          isOwner = true;
      }
      if(productFromDb.isAvailable === true){
          isReallyAvailable = true
      }
      console.log("isReallyAvailable: ", isReallyAvailable)
        res.render('inventory/productDetails', { theProduct: productFromDb, user: req.user, isOwner, isReallyAvailable })
      } )//==End then
    .catch( error => {
        console.log("Error while displaying product details: ", error);
    } )
})//==End details page




module.exports = router; 




