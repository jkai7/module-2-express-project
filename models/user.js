const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2-full-stack-project', {useMongoClient: true})

const userSchema = new Schema({
    
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    productsUpLoaded: [Schema.Types.ObjectId]

})

const User = mongoose.model(`User`, userSchema);

module.exports = User;