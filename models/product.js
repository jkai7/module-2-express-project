const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2-full-stack-project', {useMongoClient: true})

const productSchema = new Schema({
    
    productname: String,
    productType: {type: String, enum: ['Instruments', 'Electronics', 'Furniture', 'Home Appliances', 'Outdoor Equipment']},
    description:String,
    condition: {type: String, enum: ['New', 'Very Good', 'Good', 'Fair', 'Poor'], default: 'Good'},
    price: Number,
    city: String,
    areaCode: String,
    image: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" }

})

const Product = mongoose.model(`Product`, productSchema);

module.exports = Product;