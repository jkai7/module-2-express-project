const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js')
 
mongoose.connect('mongodb://localhost/module-2-full-stack-project', {useMongoClient: true})

const productSchema = new Schema({
    
    productname: String,
    productType: {type: String, enum: ['Instruments', 'Electronics', 'Furniture', 'Home Appliances', 'Outdoor Equipment']},
    description:String,
    condition: {type: String, enum: ['New', 'Very Good', 'Good', 'Fair', 'Poor'], default: 'Good'},
    price: Number,
    city: String,
    areaCode: String,
    image: {type: String, default:"/images/user-default.png"},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    isAvailable: {type: Boolean, default: true },
    ownerName: String
})

const Product = mongoose.model(`Product`, productSchema);

module.exports = Product;