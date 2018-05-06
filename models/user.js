const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2-full-stack-project', {useMongoClient: true})

const userSchema = new Schema({
    

    firstname: String,
    lastname: String,
    username: String,
    password: {type: String, min: 7, max: 15},
    email: String,

})

const User = mongoose.model(`User`, userSchema);

module.exports = User;