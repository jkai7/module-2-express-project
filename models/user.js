const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product.js')
mongoose.connect('mongodb://localhost/module-2-full-stack-project', {useMongoClient: true})

const userSchema = new Schema({
    
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    image: {type: String, default:"/images/user-default-yellow.png"},
    productsUpLoaded: [{type: Schema.Types.ObjectId, ref: "Product"}],
    productsBorrowed:[{type: Schema.Types.ObjectId, ref: "Product"}]
},
{
    usePushEach: true
  });

const User = mongoose.model(`User`, userSchema);

module.exports = User;